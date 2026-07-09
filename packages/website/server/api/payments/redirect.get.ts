import type { PriceEnum } from '~~/utils/ProductMap'
import { ProductMap } from '~~/utils/ProductMap'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const priceId = query.priceId
  const clientId = query.clientId as string | undefined
  const affiliateId = query.affiliateId as string | undefined
  const colorMode = query.colorMode as string | undefined
  const sessionId = query.sessionId as string | undefined
  const { user } = await requireUserSession(event)
  const { createCheckoutSession } = await useStripePayments()
  const { send } = createPlunkService()
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

    await sendRedirect(event, response.url!, 302)
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
