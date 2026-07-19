# nuxt-charts e2e

Verifies every chart type the module registers actually renders in a browser,
through the Nuxt module, against a freshly built `vue-chrts`.

## Run it

```bash
pnpm test:e2e:all      # fresh build, dev + prod  (the pre-release gate)
pnpm test:e2e          # dev server only
pnpm test:e2e:prod     # production build only
```

Or drive the runner directly for more control:

```bash
./scripts/run-e2e.sh                  # same as test:e2e:all
./scripts/run-e2e.sh --dev            # one mode
./scripts/run-e2e.sh --skip-build     # reuse the current vue-chrts dist
./scripts/run-e2e.sh --grep sankey    # pass args through to Playwright
```

`run-e2e.sh` prints one JSON line and sends everything else to `.artifacts/`,
so it is cheap to run in the background. Exit 0 means every mode passed.

```json
{"status":"passed","summary":"dev: 12 passed, 0 failed | prod: 12 passed, 0 failed", ...}
```

On failure the JSON carries a `log` path — read that rather than re-running.

## Why two modes

`dev` exercises the module's `optimizeDeps`/transpile setup, which only runs
during Vite pre-bundling. `prod` exercises `nuxt build` output, a different
module graph that can break (bad externals, missing SSR deps) while dev is
green. A release needs both.

The runner rebuilds `vue-chrts` from source first, because a stale `dist` is
the most common way to get a pass that means nothing.

## What each page asserts

One route per chart type under `playground/pages/coverage/`, so a failure names
the chart that broke. Per page:

- SSR responds 200 and the HTML carries Nuxt's hydration payload
- an `svg` mounts inside the chart host
- that `svg` contains actual marks — a mounted-but-empty chart still renders an
  `svg`, so mark count is what catches silent breakage
- no console errors and no `[Vue warn]` — the warning check catches charts
  driven with the wrong prop contract, which Vue reports as a warning, not an
  error

## Adding a chart type

Add `playground/pages/coverage/<name>.vue` wrapping the component in
`<div data-testid="chart-host">`, then add `<name>` to the `charts` array in
`ssr.spec.ts`. Take props from the component's type file rather than guessing —
several accessors are not named what you would expect (`BubbleChart` uses
`xAccessor`, not `x`).
