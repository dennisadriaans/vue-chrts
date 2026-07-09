#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/cf-secrets-from-dotenv.sh [dotenvPath] [wranglerEnv]
# Examples:
#   ./scripts/cf-secrets-from-dotenv.sh .env
#   ./scripts/cf-secrets-from-dotenv.sh .env production
#
# Notes:
# - This script NEVER writes secrets to disk.
# - It reads the dotenv file into this shell, then pipes values into `wrangler secret put`.
# - Public (NUXT_PUBLIC_*) vars are also set as secrets (fine for Workers).

DOTENV_PATH="${1:-.env}"
WRANGLER_ENV="${2:-}"

if [[ ! -f "$DOTENV_PATH" ]]; then
  echo "Missing dotenv file: $DOTENV_PATH" >&2
  exit 1
fi

WRANGLER=(npx wrangler)
if [[ -n "$WRANGLER_ENV" ]]; then
  WRANGLER+=(--env "$WRANGLER_ENV")
fi

set -a
# shellcheck disable=SC1090
source "$DOTENV_PATH"
set +a

# Env vars to upload as Workers secrets
SECRETS=(
  NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  NUXT_PUBLIC_GA_MEASUREMENT_ID
  NUXT_PUBLIC_GOOGLE_TAG_MANAGER

  NUXT_TURNSTILE_SITE_KEY

  NUXT_SESSION_PASSWORD
  NUXT_HUB_PROJECT_KEY

  NUXT_STRIPE_SECRET_KEY
  NUXT_STRIPE_WEBHOOK_SECRET

  NUXT_GA_API_SECRET
  NUXT_GITHUB_TOKEN
  NUXT_PLUNK_API_TOKEN

  NUXT_TURNSTILE_SECRET_KEY

  NUXT_OAUTH_GOOGLE_CLIENT_ID
  NUXT_OAUTH_GOOGLE_CLIENT_SECRET
  NUXT_OAUTH_GITHUB_CLIENT_ID
  NUXT_OAUTH_GITHUB_CLIENT_SECRET
)

for key in "${SECRETS[@]}"; do
  value="${!key-}"
  if [[ -z "$value" ]]; then
    continue
  fi
  printf %s "$value" | "${WRANGLER[@]}" secret put "$key" >/dev/null
  echo "set secret: $key"
done
