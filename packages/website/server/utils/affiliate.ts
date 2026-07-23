import { getStripeClient } from '~~/server/utils/stripe'

interface CreateCommissionParams {
  orderId: string
  affiliateAccountId: string
  amount: number
  currency: string
  metadata?: Record<string, unknown>
}

export const createCommission = async (params: CreateCommissionParams) => {
  try {
    const stripe = getStripeClient()

    const account = await stripe.accounts.retrieve(params.affiliateAccountId)
    if (!account.details_submitted || !account.payouts_enabled) {
      console.warn(`Affiliate account ${params.affiliateAccountId} is not ready for payouts`)
      return null
    }

    const existingTransfers = await stripe.transfers.list({
      limit: 10,
      destination: params.affiliateAccountId
    })

    const alreadyPaid = existingTransfers.data.some(
      transfer => transfer.metadata?.order_id === params.orderId
    )

    if (alreadyPaid) {
      console.warn(`Transfer already exists for order ${params.orderId}`)
      return null
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency.toLowerCase(),
      destination: params.affiliateAccountId,
      metadata: {
        order_id: params.orderId,
        affiliate_account_id: params.affiliateAccountId,
        ...params.metadata
      }
    })

    console.log(`Created transfer ${transfer.id} for affiliate ${params.affiliateAccountId}`)
    return transfer
  } catch (error) {
    console.error('Error creating commission:', error)
    return null
  }
}

export const calculateCommission = (amount: number, rate: number = 0.20): number => {
  return Number((amount * rate).toFixed(2))
}
