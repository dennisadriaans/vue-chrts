import type Stripe from 'stripe'
import { calculateCommission } from '~~/server/utils/affiliate'
import { getAffiliateAccountId, verifiedAffiliateIds } from '~~/server/utils/affiliate-config'
import { getStripeClient, getStripeDashboardBase } from '~~/server/utils/stripe'

const requireAdminUser = async (event: any) => {
  if (event.context?.adminUser) {
    return event.context.adminUser as { email?: string }
  }

  const session = await requireUserSession(event)
  const user = session?.user as { email?: string } | undefined

  // NOTE: Admin email is hardcoded per requirements
  // Future: Consider using role-based permission system or environment variable
  if (!user || user.email !== 'adriaansendennis@gmail.com') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required'
    })
  }

  event.context = event.context || {}
  event.context.adminUser = user
  return user
}

export default cachedEventHandler(
  async (event) => {
    await requireAdminUser(event)

    try {
      const stripe = getStripeClient()
      const dashboardBase = getStripeDashboardBase()

      // Fetch all checkout sessions with pagination
      const allSessions: Stripe.Checkout.Session[] = []
      let hasMore = true
      let lastId: string | undefined

      while (hasMore) {
        const batch: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
          limit: 100,
          ...(lastId && { starting_after: lastId })
        })

        allSessions.push(...batch.data)
        hasMore = batch.has_more
        if (batch.data.length > 0) {
          lastId = batch.data[batch.data.length - 1].id
        }
      }

      // Fetch all transfers with pagination
      const allTransfers: Stripe.Transfer[] = []
      hasMore = true
      lastId = undefined

      while (hasMore) {
        const batch: Stripe.ApiList<Stripe.Transfer> = await stripe.transfers.list({
          limit: 100,
          ...(lastId && { starting_after: lastId })
        })

        allTransfers.push(...batch.data)
        hasMore = batch.has_more
        if (batch.data.length > 0) {
          lastId = batch.data[batch.data.length - 1].id
        }
      }

      const transferByOrderId = new Map<string, Stripe.Transfer>()
      const batchInvoiceIds = new Set<string>()
      for (const transfer of allTransfers) {
        const orderId = transfer.metadata?.order_id
        if (orderId) {
          transferByOrderId.set(orderId, transfer)
        }
        // Collect batch invoice IDs so we can resolve individual order IDs
        if (transfer.metadata?.batch === 'true' && transfer.metadata?.stripe_invoice_id) {
          batchInvoiceIds.add(transfer.metadata.stripe_invoice_id)
        }
      }

      // For batch transfers, look up the invoice line items to find covered order IDs
      const batchPaidOrders = new Map<string, Stripe.Transfer>()
      for (const invoiceId of batchInvoiceIds) {
        try {
          const batchTransfer = allTransfers.find(
            t => t.metadata?.stripe_invoice_id === invoiceId && t.metadata?.batch === 'true'
          )
          if (!batchTransfer) continue

          const lineItems = await stripe.invoices.listLineItems(invoiceId, { limit: 100 })
          for (const item of lineItems.data) {
            const orderId = item.metadata?.order_id
            if (orderId) {
              batchPaidOrders.set(orderId, batchTransfer)
            }
          }
        } catch (err) {
          console.warn(`[COMMISSIONS] Failed to fetch line items for batch invoice ${invoiceId}:`, err)
        }
      }

      const affiliateAccountIds = new Set<string>()
      const commissions = allSessions
        .filter((session) => {
          if (session.payment_status !== 'paid') {
            return false
          }

          const affiliateId = session.metadata?.affiliateId ?? undefined
          return typeof affiliateId === 'string' && verifiedAffiliateIds.has(affiliateId)
        })
        .map((session) => {
          const affiliateId = session.metadata?.affiliateId ?? undefined
          const affiliateAccountId = typeof affiliateId === 'string'
            ? getAffiliateAccountId(affiliateId)
            : null

          if (affiliateAccountId && affiliateAccountId.startsWith('acct_')) {
            affiliateAccountIds.add(affiliateAccountId)
          }

          const orderTotal = session.amount_total ? session.amount_total / 100 : 0
          const commissionAmount = calculateCommission(orderTotal)
          const transfer = transferByOrderId.get(session.id) || batchPaidOrders.get(session.id)

          const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null

          return {
            id: session.id,
            amount: commissionAmount,
            currency: session.currency || 'usd',
            status: transfer ? 'PAID' : 'PENDING',
            orderId: session.id,
            stripeTransferId: transfer?.id || null,
            stripeInvoiceUrl: transfer?.metadata?.stripe_invoice_url || null,
            paymentIntentId,
            paymentDashboardUrl: paymentIntentId
              ? `${dashboardBase}/payments/${paymentIntentId}`
              : `${dashboardBase}/checkout/sessions/${session.id}`,
            createdAt: new Date(session.created * 1000),
            paidAt: transfer ? new Date(transfer.created * 1000) : null,
            metadata: session.metadata ? JSON.stringify(session.metadata) : null,
            customerEmail: session.customer_details?.email || session.metadata?.email || null,
            affiliateAccountId
          }
        })
        .filter(commission => commission.affiliateAccountId && commission.amount > 0)

      const accountDetails = new Map<string, Stripe.Account>()
      await Promise.all(
        Array.from(affiliateAccountIds).map(async (accountId) => {
          try {
            const account = await stripe.accounts.retrieve(accountId)
            accountDetails.set(accountId, account)
          } catch (error) {
            console.warn(`Failed to retrieve Stripe account ${accountId}:`, error)
          }
        })
      )

      return {
        commissions: commissions.map((commission) => {
          const account = commission.affiliateAccountId
            ? accountDetails.get(commission.affiliateAccountId)
            : undefined
          const affiliateName = account?.business_profile?.name
            || [account?.individual?.first_name, account?.individual?.last_name].filter(Boolean).join(' ')
            || 'Affiliate'

          return {
            id: commission.id,
            amount: commission.amount,
            currency: commission.currency,
            status: commission.status,
            orderId: commission.orderId,
            stripeTransferId: commission.stripeTransferId,
            stripeInvoiceUrl: commission.stripeInvoiceUrl,
            paymentIntentId: commission.paymentIntentId,
            paymentDashboardUrl: commission.paymentDashboardUrl,
            createdAt: commission.createdAt,
            paidAt: commission.paidAt,
            metadata: commission.metadata,
            customerEmail: commission.customerEmail,
            affiliate: {
              id: commission.affiliateAccountId,
              stripeAccountId: commission.affiliateAccountId,
              status: account?.details_submitted ? 'ACTIVE' : 'PENDING',
              user: {
                id: commission.affiliateAccountId,
                name: affiliateName,
                email: account?.email || account?.metadata?.signupEmail || ''
              }
            }
          }
        })
      }
    } catch (error) {
      console.error('Error fetching commissions:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch commissions'
      })
    }
  },
  {
    maxAge: -1, // No caching at CDN level
    getKey: async (event) => {
      await requireAdminUser(event)
      return 'admin-commissions'
    }
  }
)
