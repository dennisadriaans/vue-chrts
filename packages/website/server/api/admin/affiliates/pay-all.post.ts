import type Stripe from 'stripe'
import { calculateCommission } from '~~/server/utils/affiliate'
import { createBatchReverseInvoice } from '~~/server/utils/commission-invoice'
import { verifiedAffiliates, getAffiliateAccountId } from '~~/server/utils/affiliate-config'
import { getStripeClient } from '~~/server/utils/stripe'
import type { BatchLineItem } from '~~/server/utils/commission-invoice'

/**
 * Pay all pending commissions in a single batch:
 *  1. Fetch all pending commissions (reuses the commissions.get logic)
 *  2. Group by affiliate
 *  3. For each affiliate: create ONE invoice with multiple line items + ONE transfer
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user || (user as { email?: string }).email !== 'adriaansendennis@gmail.com') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admin access required' })
  }

  const body = await readBody(event)
  const { debug = false } = body || {}

  const stripe = getStripeClient()

  try {
    // ── 1. Fetch all checkout sessions + transfers to find pending ones ──
    const allSessions: Stripe.Checkout.Session[] = []
    let hasMore = true
    let lastId: string | undefined

    while (hasMore) {
      const batch: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
        limit: 100,
        ...(lastId && { starting_after: lastId })
      })
      allSessions.push(...batch.data)
      hasMore = batch.has_more ?? false
      const last = batch.data[batch.data.length - 1]
      if (last) lastId = last.id
    }

    const allTransfers: Stripe.Transfer[] = []
    hasMore = true
    lastId = undefined

    while (hasMore) {
      const tBatch: Stripe.ApiList<Stripe.Transfer> = await stripe.transfers.list({
        limit: 100,
        ...(lastId && { starting_after: lastId })
      })
      allTransfers.push(...tBatch.data)
      hasMore = tBatch.has_more ?? false
      const last = tBatch.data[tBatch.data.length - 1]
      if (last) lastId = last.id
    }

    const paidOrderIds = new Set(
      allTransfers.map(t => t.metadata?.order_id).filter(Boolean)
    )

    // ── 2. Build pending commissions grouped by affiliate ────────────────
    const pendingByAffiliate = new Map<string, {
      affiliateId: string
      accountId: string
      items: BatchLineItem[]
      currency: string
    }>()

    for (const session of allSessions) {
      if (session.payment_status !== 'paid') continue

      const affiliateId = session.metadata?.affiliateId
      if (!affiliateId) continue

      const accountId = getAffiliateAccountId(affiliateId)
      if (!accountId) continue

      // Skip already paid
      if (paidOrderIds.has(session.id)) continue

      const orderTotal = session.amount_total ? session.amount_total / 100 : 0
      const commissionAmount = calculateCommission(orderTotal)

      // Skip zero commissions
      if (commissionAmount <= 0) continue

      if (!pendingByAffiliate.has(accountId)) {
        pendingByAffiliate.set(accountId, {
          affiliateId,
          accountId,
          items: [],
          currency: session.currency || 'eur'
        })
      }

      pendingByAffiliate.get(accountId)!.items.push({
        orderId: session.id,
        commissionAmount,
        createdAt: session.created
      })
    }

    if (pendingByAffiliate.size === 0) {
      return { success: true, message: 'No pending commissions to process.', results: [] }
    }

    // ── 3. Process each affiliate ────────────────────────────────────────
    const results = []

    for (const [accountId, group] of pendingByAffiliate) {
      const affiliateConfig = verifiedAffiliates[group.affiliateId]
      const affiliateAccount = await stripe.accounts.retrieve(accountId)

      const affiliateName
        = affiliateAccount.business_profile?.name
          || [affiliateAccount.individual?.first_name, affiliateAccount.individual?.last_name].filter(Boolean).join(' ')
          || ''
      const affiliateEmail
        = affiliateAccount.email
          || affiliateConfig?.email
          || ''

      if (!affiliateName || !affiliateEmail) {
        results.push({
          affiliateId: group.affiliateId,
          accountId,
          error: 'Affiliate name or email missing — skipped.'
        })
        continue
      }

      const totalAmount = group.items.reduce((sum, i) => sum + i.commissionAmount, 0)
      const totalCents = Math.round(totalAmount * 100)

      console.log(`[PAY-ALL] Affiliate ${group.affiliateId} (${accountId}): ${group.items.length} commissions, total €${totalAmount.toFixed(2)}`)

      // ── DEBUG MODE ────────────────────────────────────────────────
      if (debug) {
        results.push({
          affiliateId: group.affiliateId,
          accountId,
          affiliateName,
          affiliateEmail,
          itemCount: group.items.length,
          totalAmount,
          items: group.items,
          action: 'Batch invoice + Single transfer (dry run)'
        })
        continue
      }

      // ── Create batch invoice ──────────────────────────────────────
      const invoice = await createBatchReverseInvoice({
        items: group.items,
        currency: group.currency,
        affiliateAccountId: accountId,
        affiliateEmail,
        affiliateName,
        affiliateCountry: affiliateConfig?.country,
        affiliateVatNumber: affiliateConfig?.vatNumber
      })

      // Verify total before transferring
      if ((invoice.total ?? 0) < totalCents) {
        console.error(`[PAY-ALL] Invoice ${invoice.id} total (${invoice.total}) < expected (${totalCents}). Aborting transfer for this affiliate.`)
        results.push({
          affiliateId: group.affiliateId,
          accountId,
          error: `Invoice ${invoice.id} has incorrect total (€${((invoice.total ?? 0) / 100).toFixed(2)} vs expected €${totalAmount.toFixed(2)}). Transfer skipped.`,
          invoiceId: invoice.id
        })
        continue
      }

      // ── Create a single transfer for the total ────────────────────
      const timestamps = group.items.map(i => i.createdAt)
      const minDate = new Date(Math.min(...timestamps) * 1000).toISOString().split('T')[0]
      const maxDate = new Date(Math.max(...timestamps) * 1000).toISOString().split('T')[0]

      const transfer = await stripe.transfers.create({
        amount: totalCents,
        currency: group.currency || 'eur',
        destination: accountId,
        metadata: {
          batch: 'true',
          period_start: minDate ?? '',
          period_end: maxDate ?? '',
          item_count: String(group.items.length),
          affiliate_account_id: accountId,
          stripe_invoice_id: invoice.id,
          stripe_invoice_url: invoice.hosted_invoice_url || ''
        }
      })

      console.log(`[PAY-ALL] Transfer ${transfer.id} — €${totalAmount.toFixed(2)} (${group.items.length} commissions) → ${accountId}`)

      results.push({
        affiliateId: group.affiliateId,
        accountId,
        itemCount: group.items.length,
        totalAmount,
        transferId: transfer.id,
        invoiceId: invoice.id,
        invoiceUrl: invoice.hosted_invoice_url || null
      })
    }

    // Invalidate the commissions cache
    await useStorage('cache').removeItem('nitro:handlers:admin-commissions.json')

    const totalPaid = results
      .filter((r): r is typeof r & { totalAmount: number } => 'totalAmount' in r && !('error' in r))
      .reduce((sum, r) => sum + r.totalAmount, 0)

    const successCount = results.filter(r => !('error' in r) && 'transferId' in r).length
    const itemCount = results
      .filter((r): r is typeof r & { itemCount: number } => 'itemCount' in r && !('error' in r))
      .reduce((sum, r) => sum + r.itemCount, 0)

    return {
      success: true,
      message: debug
        ? `Dry run: ${itemCount} commissions across ${pendingByAffiliate.size} affiliate(s), total €${totalPaid.toFixed(2)}`
        : `Processed ${itemCount} commissions across ${successCount} affiliate(s) — total €${totalPaid.toFixed(2)}`,
      results
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('[PAY-ALL] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to process batch payout'
    })
  }
})
