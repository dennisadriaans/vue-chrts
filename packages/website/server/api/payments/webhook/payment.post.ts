import Stripe from 'stripe'
import { getAffiliateAccountId, getAffiliateByAccountId } from '~~/server/utils/affiliate-config'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-02-24.acacia'
  })
  try {
    const webhookSecret = config.stripeWebhookSecret

    if (!webhookSecret) {
      throw new Error('Stripe Webhook Secret is missing')
    }
    const body = await readRawBody(event)
    const stripeSignature = getHeader(event, 'stripe-signature')
    if (!stripeSignature) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Stripe signature is missing'
      })
    }

    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body is missing'
      })
    }

    let stripeEvent
    try {
      stripeEvent = await stripe.webhooks.constructEventAsync(
        body,
        stripeSignature,
        webhookSecret
      )
    } catch (err: any) {
      throw createError({
        statusCode: 400,
        statusMessage: `Webhook Error: ${err.message}`
      })
    }

    const type = stripeEvent.type
    const relevantEvents = ['checkout.session.completed', 'checkout.session.expired']

    if (!relevantEvents.includes(type)) {
      console.log('Not a relevant event')
      return 'OK'
    }

    const data: any = stripeEvent.data.object
    if (!data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid event data'
      })
    }

    const clientId = data.metadata.clientId || null
    const colorMode = data.metadata.colorMode || undefined
    const sessionId = data.metadata.sessionId || undefined
    const transactionId = data.id
    const value = data.amount_total ? data.amount_total / 100 : 0 // Stripe amounts are in cents
    const currency = data.currency || 'USD'
    const affiliateRef = data.metadata?.affiliateId || undefined

    const { send, track } = createPlunkService()

    switch (stripeEvent['type']) {
      case 'checkout.session.completed':
        if (clientId) {
          try {
            await trackConversion({
              clientId,
              transactionId,
              value,
              currency,
              colorMode,
              sessionId
            })
            console.log('Conversion tracked for client:', clientId)
          } catch (e) {
            console.error('Error tracking conversion:', e)
          }
        } else {
          console.warn(
            'Client ID not found in Stripe session, conversion not tracked.'
          )
        }

        try {
          /* Mail to myself */
          await send({
            from: 'dennis@nuxtcharts.com',
            to: ['mail@adriaansendennis.nl'],
            subject: 'New customer',
            html: 'New paid customer with email: ' + data.customer_email
          })
        } catch (e) {
          console.error('Error sending PaymentSuccessful mail', e)
        }

        /* User Purchase email automation */
        try {
          await track({
            event: 'user-purchase',
            email: data.customer_email,
            data: {
              purchased: true
            }
          })
        } catch (error) {
          console.error('Failed to track user purchase:', error)
        }

        /* Track affiliate commission */
        if (affiliateRef) {
          const affiliateAccountId = affiliateRef.startsWith('acct_')
            ? affiliateRef
            : getAffiliateAccountId(affiliateRef)

          const affiliate = affiliateAccountId
            ? getAffiliateByAccountId(affiliateAccountId)
            : null

          if (affiliate?.email) {
            try {
              await send({
                from: 'dennis@nuxtcharts.com',
                to: [affiliate.email],
                subject: 'New Referral!',
                html: 'You have received a new referral on Nuxt Charts! The commission will be processed shortly.'
              })
            } catch (e) {
              console.error('Error sending affiliate referral mail', e)
            }
          } else {
            console.warn('Affiliate reference is not valid/verified:', affiliateRef)
          }
        }

        break
      case 'checkout.session.expired':
        try {
          await track({
            event: 'user-payment-expired',
            email: data.customer_email,
            data: {
              product: data.metadata?.product ?? 'unknown'
            }
          })
        } catch (error) {
          console.error('Failed to track user purchase:', error)
        }
        break
      case 'payment_intent.payment_failed':
        console.log('failed', data)
        // send payment failed email
        break
    }

    return 'OK'
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
