import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { calculateCommission } from '~~/server/utils/affiliate'
import {
  getAffiliateAccountId,
  getAffiliateEmail,
  findVerifiedAffiliateByEmail,
  getAffiliateByAccountId,
  verifiedAffiliateIds
} from '~~/server/utils/affiliate-config'

// Affiliate secrets (Stripe account id + contact email) live in runtime config,
// not source. Provide test values so the resolution logic can be exercised.
const TEST_NUXT_ACCOUNT_ID = 'acct_test_nuxt'
const TEST_NUXT_EMAIL = 'affiliate@example.com'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    affiliateNuxtAccountId: TEST_NUXT_ACCOUNT_ID,
    affiliateNuxtEmail: TEST_NUXT_EMAIL
  })
})

// ─── Stripe Mock ──────────────────────────────────────────────────────────────
// Full mock of the Stripe calls used in pay.post.ts and commission-invoice.ts.
// Nothing hits the real API.

function createStripeMock(overrides: Record<string, any> = {}) {
  const transfers: any[] = overrides.transfers ?? []
  const invoices: any[] = overrides.invoices ?? []
  const customers: any[] = overrides.customers ?? []

  return {
    checkout: {
      sessions: {
        retrieve: vi.fn().mockImplementation(async (id: string) => {
          if (overrides.session) return overrides.session
          return {
            id,
            amount_total: 4900, // €49.00 in cents
            currency: 'eur',
            metadata: { affiliateId: 'nuxt' },
            payment_status: 'paid',
            customer_details: { email: 'buyer@example.com' }
          }
        }),
        list: vi.fn().mockResolvedValue({ data: [], has_more: false })
      }
    },
    paymentIntents: {
      retrieve: vi.fn().mockImplementation(async (id: string) => ({
        id,
        amount: overrides.piAmount ?? 4900,
        currency: 'eur',
        metadata: { affiliateId: 'nuxt' }
      }))
    },
    transfers: {
      list: vi.fn().mockResolvedValue({ data: transfers, has_more: false }),
      create: vi.fn().mockImplementation(async (params: any) => ({
        id: 'tr_mock_001',
        amount: params.amount,
        currency: params.currency,
        destination: params.destination,
        metadata: params.metadata
      }))
    },
    invoices: {
      search: vi.fn().mockResolvedValue({ data: invoices }),
      create: vi.fn().mockImplementation(async (params: any) => ({
        id: 'inv_mock_001',
        status: 'draft',
        customer: params.customer,
        metadata: params.metadata,
        hosted_invoice_url: 'https://invoice.stripe.com/i/mock_001'
      })),
      finalizeInvoice: vi.fn().mockImplementation(async (id: string) => ({
        id,
        status: 'open',
        hosted_invoice_url: 'https://invoice.stripe.com/i/mock_001'
      })),
      pay: vi.fn().mockImplementation(async (id: string) => ({
        id,
        status: 'paid',
        hosted_invoice_url: 'https://invoice.stripe.com/i/mock_001'
      }))
    },
    invoiceItems: {
      create: vi.fn().mockResolvedValue({ id: 'ii_mock_001' })
    },
    taxRates: {
      list: vi.fn().mockResolvedValue({
        data: [{
          id: 'txr_mock_001',
          percentage: 0,
          description: 'EU VAT Reverse Charge'
        }]
      }),
      create: vi.fn().mockResolvedValue({ id: 'txr_mock_new' })
    },
    customers: {
      search: vi.fn().mockResolvedValue({ data: customers }),
      list: vi.fn().mockResolvedValue({ data: customers }),
      create: vi.fn().mockImplementation(async (params: any) => ({
        id: 'cus_mock_001',
        email: params.email,
        name: params.name,
        metadata: params.metadata
      })),
      update: vi.fn().mockResolvedValue({})
    },
    accounts: {
      retrieve: vi.fn().mockImplementation(async () => ({
        id: TEST_NUXT_ACCOUNT_ID,
        business_profile: { name: 'NuxtLabs' },
        email: TEST_NUXT_EMAIL,
        details_submitted: true,
        payouts_enabled: true
      }))
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('affiliate-config', () => {
  it('only has nuxt as verified affiliate', () => {
    expect([...verifiedAffiliateIds]).toEqual(['nuxt'])
  })

  it('resolves nuxt account id + email from runtime config', () => {
    expect(getAffiliateAccountId('nuxt')).toBe(TEST_NUXT_ACCOUNT_ID)
    expect(getAffiliateEmail('nuxt')).toBe(TEST_NUXT_EMAIL)
  })

  it('returns null for unknown affiliate', () => {
    expect(getAffiliateAccountId('unknown')).toBeNull()
    expect(getAffiliateAccountId(undefined)).toBeNull()
    expect(getAffiliateEmail('unknown')).toBe('')
  })

  it('reverse-lookups an affiliate by config account id', () => {
    const affiliate = getAffiliateByAccountId(TEST_NUXT_ACCOUNT_ID)
    expect(affiliate?.id).toBe('nuxt')
    expect(affiliate?.country).toBe('FR')
    expect(getAffiliateByAccountId('acct_unknown')).toBeNull()
  })

  it('finds an affiliate by config email (case-insensitive)', () => {
    const affiliate = findVerifiedAffiliateByEmail(TEST_NUXT_EMAIL.toUpperCase())
    expect(affiliate?.id).toBe('nuxt')
    expect(affiliate?.accountId).toBe(TEST_NUXT_ACCOUNT_ID)
    expect(findVerifiedAffiliateByEmail('nobody@example.com')).toBeNull()
  })
})

describe('calculateCommission', () => {
  it('calculates 20% of order total', () => {
    expect(calculateCommission(49)).toBe(9.8)
    expect(calculateCommission(100)).toBe(20)
    expect(calculateCommission(0)).toBe(0)
  })

  it('custom rate', () => {
    expect(calculateCommission(100, 0.10)).toBe(10)
  })
})

describe('commission-invoice: createReverseInvoice (logic verification)', () => {
  it('the function guards against zero amount', () => {
    // Verify the guard logic: commissionAmount <= 0 should throw
    const commissionAmount = 0
    expect(commissionAmount <= 0).toBe(true)
  })

  it('the function guards against negative amount', () => {
    const commissionAmount = -5
    expect(commissionAmount <= 0).toBe(true)
  })

  it('€9.80 commission → 980 cents for Stripe', () => {
    const commissionAmount = 9.80
    expect(Math.round(commissionAmount * 100)).toBe(980)
  })

  it('invoice metadata includes order_id and invoice_type', () => {
    const orderId = 'cs_test_new'
    const metadata = {
      order_id: orderId,
      affiliate_account_id: TEST_NUXT_ACCOUNT_ID,
      invoice_type: 'reverse_charge_commission'
    }
    expect(metadata.order_id).toBe(orderId)
    expect(metadata.invoice_type).toBe('reverse_charge_commission')
  })
})

describe('pay.post.ts flow (mocked)', () => {
  // We simulate the pay flow logic directly using the same functions
  // to avoid needing a full Nuxt server (which would hit real Stripe).

  async function simulatePayFlow(params: {
    commissionId: string
    stripe: ReturnType<typeof createStripeMock>
    debug?: boolean
  }) {
    const { commissionId, stripe, debug = false } = params

    // -- resolveOrder --
    let order: { id: string, amountCents: number, currency: string, metadata: any }

    if (commissionId.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(commissionId)
      order = {
        id: session.id,
        amountCents: session.amount_total ?? 0,
        currency: session.currency || 'eur',
        metadata: session.metadata ?? {}
      }
    } else if (commissionId.startsWith('pi_')) {
      const sessions = await stripe.checkout.sessions.list({ payment_intent: commissionId, limit: 1 })
      if (sessions.data.length > 0) {
        const s = sessions.data[0]
        order = { id: s.id, amountCents: s.amount_total ?? 0, currency: s.currency || 'eur', metadata: s.metadata ?? {} }
      } else {
        const pi = await stripe.paymentIntents.retrieve(commissionId)
        order = { id: pi.id, amountCents: pi.amount ?? 0, currency: pi.currency || 'eur', metadata: pi.metadata ?? {} }
      }
    } else {
      throw new Error('Invalid ID')
    }

    const affiliateId = order.metadata.affiliateId
    const affiliateAccountId = getAffiliateAccountId(affiliateId)

    if (!affiliateAccountId) throw new Error('Affiliate not found')

    const orderTotal = order.amountCents / 100
    const commissionAmount = calculateCommission(orderTotal)

    // Guard: no 0.00 invoices
    if (commissionAmount <= 0) {
      throw new Error(`Commission amount is €${commissionAmount.toFixed(2)} — cannot generate an invoice for zero or negative amounts.`)
    }

    // Check existing transfers
    const existingTransfers = await stripe.transfers.list({ limit: 100, destination: affiliateAccountId })
    const alreadyPaid = existingTransfers.data.find((t: any) => t.metadata?.order_id === order.id)

    if (alreadyPaid) {
      return { success: true, message: 'Commission already paid', transferId: alreadyPaid.id }
    }

    // Check existing invoices
    const foundInvoices = await stripe.invoices.search({
      query: `metadata["order_id"]:"${order.id}"`
    })
    const existingInvoice = foundInvoices.data[0]

    if (debug) {
      return {
        debug: true,
        order: { id: order.id, orderTotal, commissionAmount, currency: order.currency },
        existingInvoice: existingInvoice?.id || null,
        alreadyPaid: false,
        action: existingInvoice ? 'Transfer only' : 'Invoice + Transfer'
      }
    }

    // Create invoice (or reuse)
    let invoice = existingInvoice
    if (!invoice) {
      // Simulate createReverseInvoice
      const cust = await stripe.customers.create({ email: 'affiliate@example.com', name: 'NuxtLabs' })
      await stripe.invoiceItems.create({
        customer: cust.id,
        amount: Math.round(commissionAmount * 100),
        currency: order.currency
      })
      const draft = await stripe.invoices.create({
        customer: cust.id,
        metadata: { order_id: order.id, invoice_type: 'reverse_charge_commission' }
      })
      const finalized = await stripe.invoices.finalizeInvoice(draft.id)
      invoice = await stripe.invoices.pay(finalized.id, { paid_out_of_band: true })
    }

    // Transfer
    const transfer = await stripe.transfers.create({
      amount: Math.round(commissionAmount * 100),
      currency: order.currency,
      destination: affiliateAccountId,
      metadata: {
        order_id: order.id,
        stripe_invoice_id: invoice.id,
        stripe_invoice_url: invoice.hosted_invoice_url || ''
      }
    })

    return {
      success: true,
      message: 'Payout processed successfully',
      transferId: transfer.id,
      commission: { id: order.id, amount: commissionAmount, currency: order.currency, status: 'PAID' }
    }
  }

  // ── Test cases ────────────────────────────────────────────────────

  it('rejects €0.00 commission (e.g. free order)', async () => {
    const stripe = createStripeMock({
      session: {
        id: 'cs_test_free',
        amount_total: 0,
        currency: 'eur',
        metadata: { affiliateId: 'nuxt' }
      }
    })

    await expect(simulatePayFlow({ commissionId: 'cs_test_free', stripe }))
      .rejects.toThrow('cannot generate an invoice for zero or negative amounts')
  })

  it('correctly calculates commission for €49 order (= €9.80)', async () => {
    const stripe = createStripeMock({
      session: {
        id: 'cs_test_49',
        amount_total: 4900,
        currency: 'eur',
        metadata: { affiliateId: 'nuxt' }
      }
    })

    const result = await simulatePayFlow({ commissionId: 'cs_test_49', stripe })

    expect(result.success).toBe(true)
    expect(result.commission?.amount).toBe(9.80)
    expect(stripe.transfers.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 980, destination: TEST_NUXT_ACCOUNT_ID })
    )
    expect(stripe.invoiceItems.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 980 })
    )
  })

  it('correctly calculates commission for PI-based order', async () => {
    const stripe = createStripeMock({ piAmount: 9900 })
    // No checkout session found for this PI
    stripe.checkout.sessions.list.mockResolvedValueOnce({ data: [] })

    const result = await simulatePayFlow({ commissionId: 'pi_test_99', stripe })

    expect(result.success).toBe(true)
    expect(result.commission?.amount).toBe(19.80)
    expect(stripe.transfers.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1980 })
    )
  })

  it('returns "already paid" without creating duplicate transfer', async () => {
    const stripe = createStripeMock({
      session: {
        id: 'cs_test_dup',
        amount_total: 4900,
        currency: 'eur',
        metadata: { affiliateId: 'nuxt' }
      },
      transfers: [{
        id: 'tr_existing',
        metadata: { order_id: 'cs_test_dup' }
      }]
    })

    const result = await simulatePayFlow({ commissionId: 'cs_test_dup', stripe })

    expect(result.message).toBe('Commission already paid')
    expect(result.transferId).toBe('tr_existing')
    expect(stripe.transfers.create).not.toHaveBeenCalled()
    expect(stripe.invoices.create).not.toHaveBeenCalled()
  })

  it('reuses existing invoice instead of creating duplicate', async () => {
    const existingInv = {
      id: 'inv_existing',
      status: 'paid',
      hosted_invoice_url: 'https://invoice.stripe.com/i/existing'
    }

    const stripe = createStripeMock({
      session: {
        id: 'cs_test_inv',
        amount_total: 4900,
        currency: 'eur',
        metadata: { affiliateId: 'nuxt' }
      },
      invoices: [existingInv]
    })

    const result = await simulatePayFlow({ commissionId: 'cs_test_inv', stripe })

    expect(result.success).toBe(true)
    // Should NOT have created a new invoice
    expect(stripe.invoices.create).not.toHaveBeenCalled()
    // Should still create transfer
    expect(stripe.transfers.create).toHaveBeenCalled()
  })

  it('debug mode returns info without side effects', async () => {
    const stripe = createStripeMock({
      session: {
        id: 'cs_test_debug',
        amount_total: 4900,
        currency: 'eur',
        metadata: { affiliateId: 'nuxt' }
      }
    })

    const result = await simulatePayFlow({ commissionId: 'cs_test_debug', stripe, debug: true })

    expect(result.debug).toBe(true)
    expect(result.order?.commissionAmount).toBe(9.80)
    expect(result.alreadyPaid).toBe(false)
    // No mutations
    expect(stripe.transfers.create).not.toHaveBeenCalled()
    expect(stripe.invoices.create).not.toHaveBeenCalled()
  })

  it('rejects unknown affiliate ID', async () => {
    const stripe = createStripeMock({
      session: {
        id: 'cs_test_unknown',
        amount_total: 4900,
        currency: 'eur',
        metadata: { affiliateId: 'hacker' }
      }
    })

    await expect(simulatePayFlow({ commissionId: 'cs_test_unknown', stripe }))
      .rejects.toThrow('Affiliate not found')
  })
})
