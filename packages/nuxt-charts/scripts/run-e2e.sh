#!/usr/bin/env bash
# Full pre-release e2e: fresh vue-chrts build, then the Playwright suite against
# both the dev server and the production (nuxt build + Nitro) output.
#
# All build/test output goes to .artifacts/; stdout gets one JSON line so this
# is cheap to run in the background. Exit 0 = everything passed.
set -uo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
ROOT="$(cd -- "$PKG_DIR/../.." && pwd)"
ARTIFACTS="$PKG_DIR/.artifacts"

MODES=()
SKIP_BUILD=""
KEEP_CACHE=""
PLAYWRIGHT_ARGS=()

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/run-e2e.sh                   # fresh build, dev + prod
  ./scripts/run-e2e.sh --dev             # dev only
  ./scripts/run-e2e.sh --prod            # prod only
  ./scripts/run-e2e.sh --skip-build      # reuse existing vue-chrts dist
  ./scripts/run-e2e.sh --keep-cache      # keep Nuxt/Vite caches (faster, less clean)
  ./scripts/run-e2e.sh --grep sankey     # pass args through to Playwright

Emits one JSON line. Full logs land in .artifacts/.
USAGE
}

while [ $# -gt 0 ]; do
  case "$1" in
    --dev) MODES+=("dev"); shift ;;
    --prod) MODES+=("prod"); shift ;;
    --skip-build) SKIP_BUILD=1; shift ;;
    --keep-cache) KEEP_CACHE=1; shift ;;
    --grep|--test) PLAYWRIGHT_ARGS+=("$1" "${2:-}"); shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) PLAYWRIGHT_ARGS+=("$1"); shift ;;
  esac
done

if [ ${#MODES[@]} -eq 0 ]; then
  MODES=("dev" "prod")
fi

mkdir -p "$ARTIFACTS"
rm -f "$ARTIFACTS"/*.log 2>/dev/null || true

STARTED=$(date +%s)
PHASE="startup"
BUILD_LOG="$ARTIFACTS/build.log"

emit() {
  # $1 status, $2 summary, $3 optional log path
  local duration=$(( $(date +%s) - STARTED ))
  jq -n -c \
    --arg status "$1" \
    --arg summary "$2" \
    --arg phase "$PHASE" \
    --arg log "${3:-}" \
    --arg duration "${duration}s" \
    --argjson modes "$(printf '%s\n' "${MODES[@]}" | jq -R . | jq -s -c .)" \
    --argjson results "${RESULTS_JSON:-[]}" \
    '{status:$status, summary:$summary, phase:$phase, modes:$modes,
      results:$results, duration:$duration,
      summaryColor:(if $status=="passed" then "green" else "red" end)}
     | if $log == "" then . else . + {log:$log} end'
}

fail() {
  emit "failed" "$1" "${2:-}"
  exit 1
}

RESULTS_JSON="[]"

record() {
  # $1 mode, $2 status, $3 tests label, $4 log
  RESULTS_JSON=$(jq -c \
    --arg mode "$1" --arg status "$2" --arg tests "$3" --arg log "$4" \
    '. + [{mode:$mode, status:$status, tests:$tests, log:$log}]' \
    <<<"$RESULTS_JSON")
}

# Counts from Playwright's "N passed"/"N failed" summary lines.
tests_label() {
  local log="$1" passed failed
  passed=$(grep -oE '[0-9]+ passed' "$log" | tail -1 | grep -oE '[0-9]+' || true)
  failed=$(grep -oE '[0-9]+ failed' "$log" | tail -1 | grep -oE '[0-9]+' || true)
  echo "${passed:-0} passed, ${failed:-0} failed"
}

cd "$PKG_DIR"

# A stale dist is the most common source of a misleading pass, so rebuild
# vue-chrts from source unless explicitly told not to.
if [ -z "$SKIP_BUILD" ]; then
  PHASE="build"
  rm -rf "$ROOT/packages/vue/dist"
  if ! pnpm --dir "$ROOT" --filter vue-chrts run build > "$BUILD_LOG" 2>&1; then
    fail "vue-chrts build failed" "$BUILD_LOG"
  fi
  if [ ! -f "$ROOT/packages/vue/dist/index.js" ]; then
    fail "vue-chrts build produced no dist/index.js" "$BUILD_LOG"
  fi
fi

# Nuxt/Vite caches survive across modes and can mask module-resolution changes.
if [ -z "$KEEP_CACHE" ]; then
  rm -rf \
    "$PKG_DIR/playground/.nuxt" \
    "$PKG_DIR/playground/.output" \
    "$PKG_DIR/playground/node_modules/.cache" \
    "$PKG_DIR/playground/node_modules/.vite"
fi

OVERALL=0

for mode in "${MODES[@]}"; do
  PHASE="e2e:$mode"
  LOG="$ARTIFACTS/e2e-$mode.log"

  # CI=1 makes Playwright refuse to reuse a server it did not start, so each
  # mode is guaranteed to test the server it actually booted.
  if CI=1 NUXT_CHARTS_E2E_MODE="$mode" \
      pnpm exec playwright test "${PLAYWRIGHT_ARGS[@]+"${PLAYWRIGHT_ARGS[@]}"}" \
      > "$LOG" 2>&1; then
    record "$mode" "passed" "$(tests_label "$LOG")" "$LOG"
  else
    record "$mode" "failed" "$(tests_label "$LOG")" "$LOG"
    OVERALL=1
  fi
done

PHASE="done"

if [ "$OVERALL" -eq 0 ]; then
  SUMMARY=$(jq -r '[.[] | "\(.mode): \(.tests)"] | join(" | ")' <<<"$RESULTS_JSON")
  emit "passed" "$SUMMARY"
  exit 0
fi

FAILED_LOG=$(jq -r 'map(select(.status=="failed")) | .[0].log // ""' <<<"$RESULTS_JSON")
SUMMARY=$(jq -r '[.[] | "\(.mode): \(.status) (\(.tests))"] | join(" | ")' <<<"$RESULTS_JSON")
emit "failed" "$SUMMARY" "$FAILED_LOG"
exit 1
