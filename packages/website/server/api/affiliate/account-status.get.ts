import { useStripeAffiliates } from '~~/server/utils/stripe'
import { findVerifiedAffiliateByEmail } from '~~/server/utils/affiliate-config'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = session?.user as { id?: string, email?: string } | undefined
  const email = user?.email?.trim().toLowerCase()

  if (!email) {
    return {
      status: 'not_registered',
      onboardingCompleted: false
    }
  }

  try {
    const { getAccountByEmail, getAccountById } = useStripeAffiliates()

    const verifiedAffiliate = findVerifiedAffiliateByEmail(email)

    const account = verifiedAffiliate
      ? await getAccountById(verifiedAffiliate.accountId)
      : await getAccountByEmail(email)

    if (!account) {
      return {
        status: 'not_registered',
        onboardingCompleted: false
      }
    }

    const onboardingCompleted = account.details_submitted === true

    return {
      status: onboardingCompleted ? 'ACTIVE' : 'PENDING',
      onboardingCompleted,
      stripeAccountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled
    }
  } catch (error) {
    console.error('Error fetching account status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch account status'
    })
  }
})
