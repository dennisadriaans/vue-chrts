import Stripe from 'stripe'

export const getStripeClient = () => {
  return new Stripe(useRuntimeConfig().stripeSecretKey, {
    apiVersion: '2025-02-24.acacia'
  })
}

export const getStripeDashboardBase = () => {
  const secretKey = useRuntimeConfig().stripeSecretKey
  return secretKey?.startsWith('sk_test_')
    ? 'https://dashboard.stripe.com/test'
    : 'https://dashboard.stripe.com'
}

// server/composables/useStripePayments.ts
export const useStripePayments = () => {
  const stripe = getStripeClient()
  /**
   * Get payment details by ID
   * @param paymentId - The Stripe payment intent ID
   */
  const getPayment = async (paymentId: string) => {
    try {
      return await stripe.paymentIntents.retrieve(paymentId)
    } catch (error) {
      console.error('Error retrieving payment:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve payment information'
      })
    }
  }

  /**
   * Check if a payment is successful
   * @param paymentId - The Stripe payment intent ID
   * @returns Boolean indicating if payment is successful
   */
  const isPaymentSuccessful = async (paymentId: string) => {
    try {
      const payment = await getPayment(paymentId)
      return payment.status === 'succeeded'
    } catch (error) {
      console.error('Error checking payment status:', error)
      return false
    }
  }

  /**
   * List recent payments with pagination
   * @param limit - Number of payments to retrieve
   * @param startingAfter - Pagination cursor
   */
  const listPayments = async (limit = 10, startingAfter?: string) => {
    try {
      return await stripe.paymentIntents.list({
        limit,
        ...(startingAfter && { starting_after: startingAfter })
      })
    } catch (error) {
      console.error('Error listing payments:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to list payments'
      })
    }
  }

  /**
   * Get all payments for a specific customer
   * @param customerId - The Stripe customer ID
   */
  const getCustomerPayments = async (customerId: string) => {
    try {
      return await stripe.paymentIntents.list({
        customer: customerId
      })
    } catch (error) {
      console.error('Error retrieving customer payments:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve customer payments'
      })
    }
  }

  /**
   * Get payments by customer email address
   * @param email - The customer's email address
   * @returns Array of payment intents associated with the email
   */
  const getPaymentsByEmail = async (email: string) => {
    try {
      // First, find the customer(s) with this email
      const customers = await stripe.customers.list({
        email,
        limit: 100 // Retrieve up to 100 customers with this email
      })

      if (customers.data.length === 0) {
        return undefined // No customers found with this email
      }

      // Get all customer IDs that match the email
      const customerIds = customers.data.map(customer => customer.id)

      // For each customer ID, get their payments
      const paymentPromises = customerIds.map(customerId =>
        stripe.checkout.sessions.list({ customer: customerId })
      )

      // Wait for all payment retrievals to complete
      const paymentsResults = await Promise.all(paymentPromises)

      if (!paymentsResults) {
        throw createError({
          statusCode: 500,
          statusMessage: 'You dont have any payments yet'
        })
      }

      // Combine all payment results into a single array
      return paymentsResults.flatMap(result =>
        result.data.map((i) => {
          return {
            id: i.id,
            created: i.created,
            status: i.status,
            meta: i.metadata,
            amount_subtotal: i.amount_subtotal,
            amount_total: i.amount_total,
            currency: i.currency,
            invoice: i.invoice
          }
        })
      )
    } catch (error) {
      console.error('Error retrieving payments by email:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve payments by email'
      })
    }
  }

  const getInvoiceById = async (invoiceId: string) => {
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId)
      return invoice
    } catch (error: unknown) {
      console.error(
        `Error retrieving invoice with ID ${invoiceId}:`,
        error instanceof Error ? error.message : error
      )
      // You might want to throw the error or handle it more gracefully based on your application's needs.
      return null
    }
  }

  /**
   * Create a checkout session
   * @param priceId - Stripe price ID
   * @param successUrl - URL to redirect after successful payment
   * @param cancelUrl - URL to redirect if payment is cancelled
   * @param metadata - Optional metadata object
   * @returns Created checkout session
   */
  const createCheckoutSession = async (
    email: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) => {
    try {
      const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card', 'link'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],

        customer_email: email,
        expires_at: Math.floor(Date.now() / 1000) + 31 * 60, // plunk mail will delay 5 minutes after expire to fire payment intent reminder email
        customer_creation: 'if_required',
        invoice_creation: {
          enabled: true,
          invoice_data: {
            metadata: {
              ...metadata,
              priceId
            }
          }
        },
        mode: 'payment',
        billing_address_collection: 'required',
        automatic_tax: { enabled: true },
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        tax_id_collection: {
          enabled: true
        },
        payment_intent_data: {
          metadata: {
            ...metadata,
            promotekit_referral: metadata?.affiliateId || '',
            priceId
          }
        },
        metadata: {
          ...metadata,
          promotekit_referral: metadata?.affiliateId || '',
          priceId
        }
      }

      return await stripe.checkout.sessions.create(sessionCreateParams)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create checkout session'
      })
    }
  }

  /**
   * Checks if a user has made any valid payment by checking against all product price IDs.
   */
  const checkHasPaid = async function (email: string) {
    if (!email) {
      return {
        hasAccess: false,
        hasAllAccess: false,
        hasUIThemeEditor: false,
        paidProducts: []
      }
    }

    const { ProductMap, PriceEnum } = await import('~~/utils/ProductMap')
    const validPriceIds = new Set(Object.keys(ProductMap))

    const payments = await getPaymentsByEmail(email)

    const paidProducts
      = payments
        ?.filter(
          payment => payment.meta?.priceId && validPriceIds.has(payment.meta.priceId)
        )
        .map(payment => payment.meta!.priceId) || []

    const hasAllAccess = paidProducts.includes(PriceEnum.AllAccessPass) || paidProducts.includes(PriceEnum.AllAccessPassLegacy) || paidProducts.includes(PriceEnum.NuxtChartsTeams)
    const hasUIThemeEditor = paidProducts.includes(PriceEnum.NuxtUIThemeEditor)
    return {
      hasAccess: paidProducts.length > 0,
      hasAllAccess,
      hasUIThemeEditor,
      paidProducts
    }
  }

  return {
    checkHasPaid,
    getPayment,
    getInvoiceById,
    isPaymentSuccessful,
    listPayments,
    getCustomerPayments,
    getPaymentsByEmail,
    createCheckoutSession
  }
}

export const useStripeAffiliates = () => {
  const stripe = getStripeClient()

  /**
   * Get a connected account by email address
   * @param email - The affiliate's email address
   * @returns The Stripe account object if found, otherwise undefined
   */
  const getAccountByEmail = async (email: string) => {
    try {
      const accounts = await stripe.accounts.list({ limit: 100 })
      return accounts.data.find(a => a.email?.toLowerCase() === email.toLowerCase())
    } catch (error) {
      console.error('Error listing accounts by email:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to list accounts'
      })
    }
  }

  const createAccount = async (email: string, userId?: string, country?: string) => {
    try {
      return await stripe.accounts.create({
        type: 'express',
        email: email,
        country: country,
        business_type: 'individual',
        individual: { email: email },
        capabilities: { transfers: { requested: true } },
        metadata: {
          ...(userId ? { userId } : {}),
          signupEmail: email
        }
      })
    } catch (error) {
      console.error('Error creating account:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create Stripe account'
      })
    }
  }

  /**
   * Get a connected account by ID
   */
  const getAccountById = async (accountId: string) => {
    try {
      return await stripe.accounts.retrieve(accountId)
    } catch (error) {
      console.error('Error retrieving account:', error)
      return null
    }
  }

  /**
   * Create an account link for onboarding
   */
  const createAccountLink = async (accountId: string, origin: string) => {
    try {
      return await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${origin}/account?tab=affiliate&refresh=true&account=${accountId}`,
        return_url: `${origin}/account/affiliate/dashboard?account=${accountId}`,
        type: 'account_onboarding'
      })
    } catch (error) {
      console.error('Error creating account link:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create account link'
      })
    }
  }

  /**
   * Create a login link for an existing connected account
   * Only works for accounts that have completed onboarding
   */
  const createLoginLink = async (accountId: string) => {
    try {
      return await stripe.accounts.createLoginLink(accountId)
    } catch (error) {
      console.error('Error creating login link:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create login link'
      })
    }
  }

  return {
    getAccountByEmail,
    getAccountById,
    createAccount,
    createAccountLink,
    createLoginLink
  }
}
