export interface VerifiedAffiliate {
  accountId: string
  email: string
  country?: string
  vatNumber?: string
}

// Non-sensitive, static affiliate metadata. Sensitive identifiers (Stripe
// account id + contact email) are injected lazily from runtime config so they
// never live in source. See affiliateConfigKeys / getAffiliateById.
type AffiliateMeta = Omit<VerifiedAffiliate, 'accountId' | 'email'>

const affiliateMeta: Record<string, AffiliateMeta> = {
  nuxt: {
    country: 'FR'
  }
}

// Maps each affiliate id to the runtime-config keys holding its secrets.
const affiliateConfigKeys: Record<string, { accountId: 'affiliateNuxtAccountId', email: 'affiliateNuxtEmail' }> = {
  nuxt: { accountId: 'affiliateNuxtAccountId', email: 'affiliateNuxtEmail' }
}

/**
 * Resolve a verified affiliate's Stripe account id from runtime config.
 * Must be called inside a request handler (Nitro provides the config there).
 */
export const getAffiliateAccountId = (affiliateId: string | undefined): string | null => {
  if (!affiliateId) return null
  const key = affiliateConfigKeys[affiliateId]?.accountId
  if (!key) return null
  return (useRuntimeConfig()[key] as string) || null
}

/**
 * Resolve a verified affiliate's contact email from runtime config.
 * Must be called inside a request handler (Nitro provides the config there).
 */
export const getAffiliateEmail = (affiliateId: string): string => {
  const key = affiliateConfigKeys[affiliateId]?.email
  if (!key) return ''
  return (useRuntimeConfig()[key] as string) || ''
}

/**
 * Build a fully-resolved VerifiedAffiliate (static metadata + config secrets)
 * for a given affiliate id, or null if the id is unknown.
 * Must be called inside a request handler.
 */
export const getAffiliateById = (affiliateId: string | undefined): (VerifiedAffiliate & { id: string }) | null => {
  if (!affiliateId) return null
  const meta = affiliateMeta[affiliateId]
  if (!meta) return null
  return {
    ...meta,
    id: affiliateId,
    accountId: getAffiliateAccountId(affiliateId) || '',
    email: getAffiliateEmail(affiliateId)
  }
}

/**
 * Fully-resolved map of verified affiliates (config secrets injected).
 * Must be called inside a request handler. Prefer the targeted lookups below
 * where possible so you only touch config for the affiliate you need.
 */
export const getVerifiedAffiliates = (): Record<string, VerifiedAffiliate & { id: string }> => {
  const out: Record<string, VerifiedAffiliate & { id: string }> = {}
  for (const id of Object.keys(affiliateMeta)) {
    const resolved = getAffiliateById(id)
    if (resolved) out[id] = resolved
  }
  return out
}

/**
 * Find a verified affiliate whose runtime-config email matches the given email.
 * Must be called inside a request handler (resolves emails via runtime config).
 */
export const findVerifiedAffiliateByEmail = (email: string): (VerifiedAffiliate & { id: string }) | null => {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null
  for (const id of Object.keys(affiliateMeta)) {
    if (getAffiliateEmail(id).toLowerCase() === normalized) {
      return getAffiliateById(id)
    }
  }
  return null
}

export const verifiedAffiliateIds = new Set(Object.keys(affiliateMeta))

export const getAffiliateByAccountId = (accountId: string): (VerifiedAffiliate & { id: string }) | null => {
  if (!accountId) return null
  for (const id of Object.keys(affiliateMeta)) {
    if (getAffiliateAccountId(id) === accountId) {
      return getAffiliateById(id)
    }
  }
  return null
}
