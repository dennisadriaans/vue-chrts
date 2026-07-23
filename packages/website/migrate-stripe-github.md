# Plan: Stripe + GitHub Developer Handoff Document

## Scope
- Stripe payment initiation, checkout sessions, webhook processing, and payment validation
- GitHub OAuth login, username capture, and repository invitation flow
- Security vulnerabilities with severity ratings and fixes
- Code quality improvements (idempotency, error handling, input validation)
- **Excluded**: Affiliate commission system (per user decision)

## Key Decisions
- Output: `HANDOFF.md` at project root
- GitHub username should be captured at OAuth time and persisted in users table (currently lost)
- Affiliates excluded from scope

## Content Outline for HANDOFF.md

### Section 1: System Overview
Brief description of what the system does: sells Nuxt UI templates, takes payment via Stripe, grants buyers access to private GitHub repos.

### Section 2: Current Architecture — Stripe Payment Flow
Describe each step with current file references:
1. **Purchase initiation** — client-side `usePayments()` composable, two entry paths (authenticated POST, unauthenticated redirect via OAuth)
2. **Checkout session creation** — `createCheckoutSession()` in `server/utils/stripe.ts`, metadata captured (affiliateId, clientId, colorMode, sessionId)
3. **Webhook processing** — `server/api/payments/webhook/payment.post.ts`, events handled, actions taken per event type
4. **Payment verification** — `checkHasPaid()` queries Stripe API by customer email, cross-refs with `ProductMap`
5. **Product mapping** — `PriceEnum` + `ProductMap` in `utils/ProductMap.ts`

### Section 3: Current Architecture — GitHub Invite Flow
1. **OAuth login** — `server/api/auth/github.ts` uses `defineOAuthGitHubEventHandler`, captures email/name/avatar but NOT `login`
2. **Username collection** — manual entry on `/account` page, stored ONLY in `localStorage`
3. **Repository listing** — unauthenticated `server/api/github/repositories.get.ts`, trusts `x-github-username` header
4. **Invitation sending** — `server/api/github/repository-access.post.ts`, verifies payment via Stripe, calls Octokit `PUT /repos/{owner}/{repo}/collaborators/{username}`
5. **Access checking** — `checkRepositoryAccess()` and `getRepoContributors()` in `server/utils/github.ts`

### Section 4: Security Vulnerabilities (with severity and fix)

**CRITICAL**:
- Hardcoded webhook secret in dev mode (line 13-15 of webhook handler) — move to env var even for dev
- Invoice endpoint (`/api/payments/invoices/[id]`) has NO authentication — add `requireUserSession()` + verify invoice ownership
- GitHub repositories endpoint has NO authentication — add `requireUserSession()`
- No rate limiting on any API routes

**HIGH**:
- No webhook idempotency — duplicate events cause duplicate emails/tracking
- Admin check via hardcoded email string — use `UserRole.ADMIN` from schema
- GitHub username from unvalidated header — validate format + require authentication

**MEDIUM**:
- GitHub username stored only in localStorage (not synced to DB, device-specific)
- No validation that GitHub username actually exists before sending invite
- `checkRepositoryAccess` returns `'not-found'` string instead of typed result

### Section 5: Improved Implementation Plan

**Phase 1: Data Model (blocks Phase 2-4)**
- Add `githubUsername` column to `users` table
- Capture `login` from GitHub OAuth response in `mapGitHubUser()` and persist it
- Allow user to update GitHub username via authenticated API endpoint

**Phase 2: Security Hardening (parallel with Phase 3)**
- Remove hardcoded webhook secret; always use `NUXT_STRIPE_WEBHOOK_SECRET` env var
- Add `requireUserSession()` to invoice endpoint + ownership check
- Add `requireUserSession()` to repositories endpoint; use session user's stored username
- Add GitHub username format validation (regex: `/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i`)
- Create webhook event log table; check event ID before processing (idempotency)
- Replace hardcoded admin email with role-based check using `UserRole.ADMIN`
- Add rate limiting middleware (Cloudflare WAF rules or h3 middleware)

**Phase 3: Stripe Flow Improvements (parallel with Phase 2)**
- Validate `priceId` parameter in checkout creation against `ProductMap` keys before calling Stripe
- Add structured error responses instead of generic 500s
- Log webhook processing outcomes to a database table for audit trail
- Handle `payment_intent.payment_failed` event properly (currently just `console.log`)

**Phase 4: GitHub Flow Improvements (depends on Phase 1)**
- Auto-populate GitHub username on account page from DB instead of localStorage
- Validate username exists via GitHub API before attempting invite (`GET /users/{username}`)
- Return meaningful error when GitHub username doesn't exist
- Track invitation history in DB (username, repo, timestamp, status)
- Remove reliance on `x-github-username` header; always use authenticated session's stored username

**Phase 5: Verification**
- Test webhook signature verification with both valid and invalid signatures
- Test idempotency by sending duplicate webhook events
- Test invoice endpoint cannot be accessed unauthenticated or by wrong user
- Test repositories endpoint requires authentication
- Test GitHub username validation rejects invalid formats
- Test full purchase → invite flow end-to-end
- Test GitHub username capture during OAuth login

### Section 6: Relevant Files Reference

| File | Purpose |
|------|---------|
| `utils/ProductMap.ts` | `PriceEnum` and `ProductMap` — maps Stripe price IDs to product titles and admin/repo slugs |
| `server/utils/stripe.ts` | `getStripeClient()`, `useStripePayments()` — checkout session creation, `checkHasPaid()`, invoice retrieval |
| `server/utils/github.ts` | Octokit wrapper — `checkRepositoryAccess()`, `inviteToRepository()`, `getRepoContributors()`, `getAllRepos()` |
| `server/api/payments/webhook/payment.post.ts` | Stripe webhook handler — signature verification, event routing |
| `server/api/payments/[product]/create.post.ts` | Authenticated checkout session creation |
| `server/api/payments/redirect.get.ts` | Redirect-based checkout for post-OAuth flow |
| `server/api/github/repository-access.post.ts` | Main invitation handler — verifies payment, invites to repo |
| `server/api/github/repositories.get.ts` | Lists repos with user invite status (UNAUTHENTICATED) |
| `server/api/payments/invoices/[id].get.ts` | Invoice URL retrieval (UNAUTHENTICATED) |
| `server/api/auth/github.ts` | GitHub OAuth handler — does NOT capture `login` field |
| `server/utils/oauth.ts` | Shared OAuth success handler — creates/updates user, sets session |
| `server/db/schema/users.ts` | User table schema — no `githubUsername` column |
| `app/composables/usePayments.ts` | Client-side purchase flow — `purchaseDashboard()`, GA tracking |
| `server/routes/buy/all-access.get.ts` | Landing page redirect to checkout |
| `.env.example` | All environment variables |

### Section 7: Environment Variables

| Variable | Purpose |
|----------|---------|
| `NUXT_STRIPE_SECRET_KEY` | Server-side Stripe API key |
| `NUXT_STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe key (currently unused in flow) |
| `NUXT_GITHUB_TOKEN` | Personal access token for Octokit repo invitations |
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `NUXT_PLUNK_API_TOKEN` | Email service (Plunk) API token |
| `NUXT_GA_API_SECRET` | Google Analytics Measurement Protocol secret |
| `NUXT_SESSION_PASSWORD` | Session encryption key |

## Status: Ready for implementation

