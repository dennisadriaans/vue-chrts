import type { PriceEnum } from '~~/utils/ProductMap'
import { ProductMap } from '~~/utils/ProductMap'

export default defineEventHandler(async (event) => {
  const priceId = getRouterParam(event, 'product')
  const { user } = await requireUserSession(event)
  const { createCheckoutSession } = await useStripePayments()
  const { send } = createPlunkService()
  const { clientId, affiliateId, colorMode, sessionId } = await readBody(event)

  try {
    const response = await createCheckoutSession(
      user.email,
      priceId as string,
      'https://nuxtcharts.com/payments',
      'https://nuxtcharts.com/payments/failed',
      {
        product: ProductMap[priceId as PriceEnum]!.title,
        clientId: clientId || '',
        email: user.email,
        affiliateId: affiliateId || '',
        colorMode: colorMode || '',
        sessionId: sessionId || ''
      }
    )

    return response.url
  } catch (error) {
    try {
      await send({
        from: 'dennis@nuxtcharts.com',
        to: 'mail@adriaansendennis.nl',
        subject: 'Stripe ERROR!',
        html: `${error}`
      })
    } catch (e) {
      console.error('Error sending feedback email:', e)
    }
    throw error
  }
})
