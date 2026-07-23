import type Stripe from 'stripe'
import { getStripeClient } from '~~/server/utils/stripe'

interface ReverseInvoiceParams {
  commissionAmount: number
  currency: string
  orderId: string
  affiliateAccountId: string
  affiliateEmail: string
  affiliateName: string
  affiliateVatNumber?: string
  affiliateCountry?: string
}

export interface BatchLineItem {
  orderId: string
  commissionAmount: number
  createdAt: number // Unix timestamp
}

interface BatchReverseInvoiceParams {
  items: BatchLineItem[]
  currency: string
  affiliateAccountId: string
  affiliateEmail: string
  affiliateName: string
  affiliateVatNumber?: string
  affiliateCountry?: string
}

const COMPANY_NAME = 'Dennis Adriaansen'
const COMPANY_VAT = 'NL.002.340.131.B19'
const COMPANY_ADDRESS = 'Zinker 11, 5345RC Oss, The Netherlands'

async function findOrCreateTaxRate(stripe: Stripe): Promise<Stripe.TaxRate> {
  const existingRates = await stripe.taxRates.list({ active: true, limit: 100 })
  const found = existingRates.data.find(
    r => r.percentage === 0 && r.description === 'EU VAT Reverse Charge'
  )
  if (found) return found

  return stripe.taxRates.create({
    display_name: 'Reverse Charge VAT',
    description: 'EU VAT Reverse Charge',
    jurisdiction: 'NL',
    percentage: 0,
    inclusive: false,
    metadata: {
      type: 'reverse_charge',
      directive: 'Article 196 EU VAT Directive'
    }
  })
}

async function findOrCreateCustomer(
  stripe: Stripe,
  params: { affiliateAccountId: string, affiliateEmail: string, affiliateName: string }
): Promise<Stripe.Customer> {
  const byMetadata = await stripe.customers.search({
    query: `metadata["stripeConnectAccountId"]:"${params.affiliateAccountId}"`
  })

  const metaCustomer = byMetadata.data[0]
  if (metaCustomer) {
    console.log(`[INVOICE] Found customer by metadata: ${metaCustomer.id} (${metaCustomer.email})`)
    return metaCustomer
  }

  const byEmail = await stripe.customers.list({ email: params.affiliateEmail, limit: 1 })
  const emailCustomer = byEmail.data[0]
  if (emailCustomer) {
    console.log(`[INVOICE] Found customer by email: ${emailCustomer.id} (${emailCustomer.email})`)
    await stripe.customers.update(emailCustomer.id, {
      metadata: { ...emailCustomer.metadata, stripeConnectAccountId: params.affiliateAccountId, type: 'affiliate' }
    })
    return emailCustomer
  }

  const customer = await stripe.customers.create({
    email: params.affiliateEmail,
    name: params.affiliateName,
    metadata: {
      stripeConnectAccountId: params.affiliateAccountId,
      type: 'affiliate'
    }
  })
  console.log(`[INVOICE] Created new customer: ${customer.id}`)
  return customer
}

function buildFooter(affiliateVatNumber?: string): string {
  const lines = [
    'Self-billing invoice — Factuur uitgereikt door afnemer',
    'VAT Reverse Charge — Btw verlegd — Autoliquidation (Article 196 EU VAT Directive)',
    `Issuer: ${COMPANY_NAME} | VAT: ${COMPANY_VAT} | ${COMPANY_ADDRESS}`
  ]
  if (affiliateVatNumber) {
    lines.push(`Affiliate VAT: ${affiliateVatNumber}`)
  }
  return lines.join('\n')
}

/**
 * Creates a self-billed reverse-charge commission invoice.
 *
 * Legal context: NL platform paying a commission to an EU affiliate.
 * Under Article 196 of the EU VAT Directive the reverse-charge mechanism
 * applies → VAT rate 0%, "Btw verlegd / Autoliquidation" must appear on
 * the invoice and the invoice is issued by the buyer (self-billing).
 */
export const createReverseInvoice = async (params: ReverseInvoiceParams): Promise<Stripe.Invoice> => {
  const amountCents = Math.round(params.commissionAmount * 100)

  if (amountCents <= 0) {
    throw new Error(`Cannot create an invoice for €${params.commissionAmount.toFixed(2)} (${amountCents} cents).`)
  }

  const stripe = getStripeClient()

  console.log(`[INVOICE] Creating reverse-charge invoice: €${params.commissionAmount} (${amountCents} cents) for order ${params.orderId}`)

  const taxRate = await findOrCreateTaxRate(stripe)
  const customer = await findOrCreateCustomer(stripe, params)

  // ── Create the DRAFT invoice first ──────────────────────────────────
  const draft = await stripe.invoices.create({
    customer: customer.id,
    auto_advance: false,
    collection_method: 'send_invoice',
    days_until_due: 0,
    footer: buildFooter(params.affiliateVatNumber),
    metadata: {
      order_id: params.orderId,
      affiliate_account_id: params.affiliateAccountId,
      invoice_type: 'reverse_charge_commission'
    },
    description: `Commission invoice for order ${params.orderId}`
  })

  console.log(`[INVOICE] Created draft invoice: ${draft.id}`)

  // ── Attach the line item explicitly to this draft ───────────────────
  const invoiceItem = await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: draft.id,
    amount: amountCents,
    currency: params.currency.toLowerCase(),
    description: `Affiliate commission — order ${params.orderId}`,
    tax_rates: [taxRate.id],
    metadata: {
      order_id: params.orderId,
      affiliate_account_id: params.affiliateAccountId
    }
  })

  console.log(`[INVOICE] Attached line item: ${invoiceItem.id} — ${amountCents} cents`)

  // ── Finalize ────────────────────────────────────────────────────────
  const finalized = await stripe.invoices.finalizeInvoice(draft.id)

  console.log(`[INVOICE] Finalized: ${finalized.id} — total: ${finalized.total} cents — status: ${finalized.status}`)

  if (finalized.total === 0 && amountCents > 0) {
    console.error(`[INVOICE] BUG: Invoice ${finalized.id} has total=0 but expected ${amountCents} cents. Voiding.`)
    await stripe.invoices.voidInvoice(finalized.id)
    throw new Error(`Invoice ${finalized.id} was created with €0.00 total instead of €${params.commissionAmount}. Voided. Please retry.`)
  }

  if (finalized.status === 'paid') {
    return finalized
  }

  const paid = await stripe.invoices.pay(finalized.id, { paid_out_of_band: true })
  console.log(`[INVOICE] Marked as paid: ${paid.id}`)
  return paid
}

/**
 * Creates a single self-billed reverse-charge invoice with multiple line items
 * (one per commission / order). Used for batch "Pay All" payouts.
 */
export const createBatchReverseInvoice = async (params: BatchReverseInvoiceParams): Promise<Stripe.Invoice> => {
  if (!params.items.length) {
    throw new Error('No items provided for batch invoice.')
  }

  const totalCents = params.items.reduce((sum, item) => sum + Math.round(item.commissionAmount * 100), 0)

  if (totalCents <= 0) {
    throw new Error(`Cannot create a batch invoice for €${(totalCents / 100).toFixed(2)}.`)
  }

  const stripe = getStripeClient()
  const timestamps = params.items.map(i => i.createdAt)
  const minDate = new Date(Math.min(...timestamps) * 1000).toISOString().split('T')[0]
  const maxDate = new Date(Math.max(...timestamps) * 1000).toISOString().split('T')[0]

  console.log(`[INVOICE-BATCH] Creating batch invoice: ${params.items.length} items, total €${(totalCents / 100).toFixed(2)} (${minDate} to ${maxDate})`)

  const taxRate = await findOrCreateTaxRate(stripe)
  const customer = await findOrCreateCustomer(stripe, params)

  // ── Create the DRAFT invoice ────────────────────────────────────────
  const draft = await stripe.invoices.create({
    customer: customer.id,
    auto_advance: false,
    collection_method: 'send_invoice',
    days_until_due: 0,
    footer: buildFooter(params.affiliateVatNumber),
    metadata: {
      period_start: minDate ?? '',
      period_end: maxDate ?? '',
      affiliate_account_id: params.affiliateAccountId,
      invoice_type: 'reverse_charge_commission',
      batch: 'true',
      item_count: String(params.items.length)
    },
    description: `Batch commission invoice — ${params.items.length} orders (${minDate} to ${maxDate})`
  })

  console.log(`[INVOICE-BATCH] Created draft invoice: ${draft.id}`)

  // ── Attach one line item per commission ─────────────────────────────
  for (const item of params.items) {
    const cents = Math.round(item.commissionAmount * 100)
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: draft.id,
      amount: cents,
      currency: params.currency.toLowerCase(),
      description: `Affiliate commission — order ${item.orderId}`,
      tax_rates: [taxRate.id],
      metadata: {
        order_id: item.orderId,
        affiliate_account_id: params.affiliateAccountId
      }
    })
    console.log(`[INVOICE-BATCH] Attached line item: ${invoiceItem.id} — ${cents} cents — order ${item.orderId}`)
  }

  // ── Finalize ────────────────────────────────────────────────────────
  const finalized = await stripe.invoices.finalizeInvoice(draft.id)

  console.log(`[INVOICE-BATCH] Finalized: ${finalized.id} — total: ${finalized.total} cents — status: ${finalized.status}`)

  if (finalized.total === 0 && totalCents > 0) {
    console.error(`[INVOICE-BATCH] BUG: Invoice ${finalized.id} has total=0 but expected ${totalCents} cents. Voiding.`)
    await stripe.invoices.voidInvoice(finalized.id)
    throw new Error(`Batch invoice ${finalized.id} was created with €0.00. Voided. Please retry.`)
  }

  if (finalized.status === 'paid') {
    return finalized
  }

  const paid = await stripe.invoices.pay(finalized.id, { paid_out_of_band: true })
  console.log(`[INVOICE-BATCH] Marked as paid: ${paid.id}`)
  return paid
}
