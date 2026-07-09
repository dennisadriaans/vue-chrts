import { useStripeAffiliates } from '~~/server/utils/stripe'
import { verifiedAffiliates } from '~~/server/utils/affiliate-config'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = session?.user as { id?: string, email?: string } | undefined
  const email = (user?.email || '').trim().toLowerCase()
  const { country } = await readBody(event) || {}

  const allowedEmails = ['seb@atinux.com', 'mail@adriaansendennis.nl', 'adriaansendennis@gmail.com']

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }

  if (!allowedEmails.includes(email)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: You are not authorized to join the affiliate program.'
    })
  }

  try {
    const { getAccountByEmail, getAccountById, createAccount, createAccountLink, createLoginLink } = useStripeAffiliates()
    const { origin } = getRequestURL(event)

    // Check if user is a verified affiliate with an existing account
    const verifiedAffiliate = Object.values(verifiedAffiliates).find(
      a => a.email.toLowerCase() === email
    )

    if (verifiedAffiliate) {
      // User has an existing verified affiliate account
      const existingAccount = await getAccountById(verifiedAffiliate.accountId)

      if (existingAccount) {
        // Check if onboarding is complete (charges_enabled indicates full onboarding)
        if (existingAccount.charges_enabled || existingAccount.details_submitted) {
          // Account is fully onboarded, create a login link
          const loginLink = await createLoginLink(existingAccount.id)
          return {
            url: loginLink.url,
            accountId: existingAccount.id,
            isExistingAccount: true
          }
        } else {
          // Account exists but onboarding not complete, create onboarding link
          const accountLink = await createAccountLink(existingAccount.id, origin)
          return {
            url: accountLink.url,
            accountId: existingAccount.id,
            isExistingAccount: true,
            needsOnboarding: true
          }
        }
      }
    }

    // Check if there's an existing Stripe account by email (not in verified list)
    let account = await getAccountByEmail(email)

    if (account) {
      // Existing account found by email
      if (account.charges_enabled || account.details_submitted) {
        const loginLink = await createLoginLink(account.id)
        return {
          url: loginLink.url,
          accountId: account.id,
          isExistingAccount: true
        }
      } else {
        // Account exists but needs to complete onboarding
        const accountLink = await createAccountLink(account.id, origin)
        return {
          url: accountLink.url,
          accountId: account.id,
          isExistingAccount: true,
          needsOnboarding: true
        }
      }
    }

    // No existing account, create a new one
    account = await createAccount(email, user?.id, country)
    const accountLink = await createAccountLink(account.id, origin)

    return {
      url: accountLink.url,
      accountId: account.id,
      isExistingAccount: false
    }
  } catch (error) {
    console.error('Error in affiliate onboarding:', error)
    throw error
  }
})
