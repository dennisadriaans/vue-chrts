export const verifiedAffiliates: Record<string, {
  accountId: string
  email: string
  country?: string
  vatNumber?: string
}> = {
  nuxt: {
    accountId: 'acct_1T1UsRPNofVDB3JC',
    email: 'seb@atinux.com',
    country: 'FR'
  }
}

export const verifiedAffiliateIds = new Set(Object.keys(verifiedAffiliates))

export const getAffiliateAccountId = (affiliateId: string | undefined): string | null => {
  if (!affiliateId) return null
  return verifiedAffiliates[affiliateId]?.accountId || null
}

export const getAffiliateByAccountId = (accountId: string) => {
  return Object.values(verifiedAffiliates).find(a => a.accountId === accountId) || null
}
