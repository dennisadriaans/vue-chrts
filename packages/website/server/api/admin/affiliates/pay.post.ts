import { calculateCommission } from '~~/server/utils/affiliate'
import { createReverseInvoice } from '~~/server/utils/commission-invoice'
import { getAffiliateAccountId, verifiedAffiliates } from '~~/server/utils/affiliate-config'
import { getStripeClient } from '~~/server/utils/stripe'

/**
 * Resolves the order amount (in cents) and a stable order ID from either
 * a Checkout Session (`cs_*`) or a Payment Intent (`pi_*`).
 */
async function resolveOrder(stripe: ReturnType<typeof getStripeClient>, commissionId: string) {
  if (commissionId.startsWith('cs_')) {
    const session = await stripe.checkout.sessions.retrieve(commissionId)
    return {
      id: session.id,
      amountCents: session.amount_total ?? 0,
      currency: session.currency || 'eur',
      metadata: session.metadata ?? {}
    }
  }

  if (commissionId.startsWith('pi_')) {
    // Try to find the checkout session that created this PI
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: commissionId,
      limit: 1
    })

    if (sessions.data.length > 0) {
      const session = sessions.data[0]
      return {
        id: session.id,
        amountCents: session.amount_total ?? 0,
        currency: session.currency || 'eur',
        metadata: session.metadata ?? {}
      }
    }

    // Fallback: use the PI directly
    const pi = await stripe.paymentIntents.retrieve(commissionId)
    return {
      id: pi.id,
      amountCents: pi.amount ?? 0,
      currency: pi.currency || 'eur',
      metadata: pi.metadata ?? {}
    }
  }

  throw createError({ statusCode: 400, statusMessage: 'Invalid commission ID format – expected cs_* or pi_*' })
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user || user.email !== 'adriaansendennis@gmail.com') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admin access required' })
  }

  const body = await readBody(event)

  const { commissionId, debug = false } = body

  if (!commissionId) {
    throw createError({ statusCode: 400, statusMessage: 'Commission ID is required' })
  }

  const stripe = getStripeClient()

  try {
    // ── 1. Resolve the order ──────────────────────────────────────────
    const order = await resolveOrder(stripe, commissionId)

    const affiliateId = order.metadata.affiliateId
    const affiliateAccountId = getAffiliateAccountId(affiliateId)

    if (!affiliateAccountId || !affiliateAccountId.startsWith('acct_')) {
      throw createError({ statusCode: 400, statusMessage: 'Affiliate Stripe account not found' })
    }

    // ── 2. Calculate commission ───────────────────────────────────────
    const orderTotal = order.amountCents / 100
    const commissionAmount = calculateCommission(orderTotal)

    console.log(`[PAY] Order ${order.id} | total: €${orderTotal} | commission: €${commissionAmount} | affiliate: ${affiliateId} → ${affiliateAccountId}`)

    // ── 3. Guard: never create an invoice for €0.00 ───────────────────
    if (commissionAmount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Commission amount is €${commissionAmount.toFixed(2)} — cannot generate an invoice for zero or negative amounts.`
      })
    }

    // ── 4. Check if already paid (transfer exists) ────────────────────
    const existingTransfers = await stripe.transfers.list({
      limit: 100,
      destination: affiliateAccountId
    })

    const alreadyPaid = existingTransfers.data.find(
      transfer => transfer.metadata?.order_id === order.id
    )

    if (alreadyPaid) {
      console.log(`[PAY] Already paid — transfer ${alreadyPaid.id} exists for order ${order.id} (amount: ${alreadyPaid.amount})`)
      return {
        success: true,
        message: `Commission already paid (transfer ${alreadyPaid.id})`,
        transferId: alreadyPaid.id,
        stripeInvoiceUrl: alreadyPaid.metadata?.stripe_invoice_url || null,
        commission: {
          id: order.id,
          amount: commissionAmount,
          currency: order.currency,
          status: 'PAID'
        }
      }
    }

    // ── 5. Check if invoice already exists (avoid duplicates) ─────────
    const foundInvoices = await stripe.invoices.search({
      query: `metadata["order_id"]:"${order.id}" AND metadata["invoice_type"]:"reverse_charge_commission"`
    })
    // Ignore €0.00 invoices (created by a previous bug) — only reuse invoices with a real amount
    const existingInvoice = foundInvoices.data.find(inv => (inv.total ?? 0) > 0) || null

    // ── 6. Resolve affiliate details ──────────────────────────────────
    const affiliateConfig = affiliateId ? verifiedAffiliates[affiliateId] : undefined
    const affiliateAccount = await stripe.accounts.retrieve(affiliateAccountId)

    const affiliateName
      = affiliateAccount.business_profile?.name
        || [affiliateAccount.individual?.first_name, affiliateAccount.individual?.last_name].filter(Boolean).join(' ')
        || ''
    const affiliateEmail
      = affiliateAccount.email
        || affiliateConfig?.email
        || ''

    if (!affiliateName || !affiliateEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Affiliate name or email is missing — cannot generate a legal invoice without this information.'
      })
    }

    // ── DEBUG MODE: return state without side-effects ──────────────────
    if (debug) {
      return {
        debug: true,
        order: {
          id: order.id,
          amountCents: order.amountCents,
          orderTotal,
          commissionAmount,
          currency: order.currency
        },
        affiliate: {
          id: affiliateId,
          accountId: affiliateAccountId,
          name: affiliateName,
          email: affiliateEmail,
          country: affiliateConfig?.country
        },
        existingInvoice: existingInvoice
          ? { id: existingInvoice.id, status: existingInvoice.status, url: existingInvoice.hosted_invoice_url }
          : null,
        alreadyPaid: false,
        action: existingInvoice ? 'Transfer only (invoice exists)' : 'Invoice + Transfer'
      }
    }

    // ── 7. Create invoice (or reuse existing) ─────────────────────────
    const invoice = existingInvoice || await createReverseInvoice({
      commissionAmount,
      currency: order.currency,
      orderId: order.id,
      affiliateAccountId,
      affiliateEmail,
      affiliateName,
      affiliateCountry: affiliateConfig?.country,
      affiliateVatNumber: affiliateConfig?.vatNumber
    })

    // Verify the invoice has the correct amount before transferring funds
    const expectedCents = Math.round(commissionAmount * 100)
    if ((invoice.total ?? 0) < expectedCents) {
      console.error(`[PAY] Invoice ${invoice.id} total (${invoice.total}) does not match expected (${expectedCents}). Aborting transfer.`)
      throw createError({
        statusCode: 500,
        statusMessage: `Invoice ${invoice.id} has incorrect total (€${((invoice.total ?? 0) / 100).toFixed(2)} vs expected €${commissionAmount.toFixed(2)}). Invoice may need to be voided in Stripe dashboard.`
      })
    }

    console.log(`[PAY] Invoice ${invoice.id} verified — total: ${invoice.total} cents. Proceeding to transfer €${commissionAmount} to ${affiliateAccountId}.`)

    // ── 8. Transfer funds ────────────────────────────────────────────
    const transfer = await stripe.transfers.create({
      amount: Math.round(commissionAmount * 100),
      currency: order.currency,
      destination: affiliateAccountId,
      metadata: {
        order_id: order.id,
        affiliate_account_id: affiliateAccountId,
        order_total: String(orderTotal),
        stripe_invoice_id: invoice.id,
        stripe_invoice_url: invoice.hosted_invoice_url || ''
      }
    })

    console.log(`[PAY] Transfer created: ${transfer.id} — €${commissionAmount} → ${affiliateAccountId}`)

    // Invalidate the commissions cache so the list refreshes
    await useStorage('cache').removeItem('nitro:handlers:admin-commissions.json')

    return {
      success: true,
      message: 'Payout processed successfully',
      transferId: transfer.id,
      stripeInvoiceUrl: invoice.hosted_invoice_url || null,
      commission: {
        id: order.id,
        amount: commissionAmount,
        currency: order.currency,
        status: 'PAID'
      }
    }
  } catch (error) {
    // Re-throw H3 errors as-is
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error processing payout:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to process payout'
    })
  }
})
