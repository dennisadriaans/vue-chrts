import { PriceEnum } from '~~/utils/ProductMap'

const getGaClientId = (gaCookie?: string) => {
  if (!gaCookie) {
    return undefined
  }

  const parts = gaCookie.split('.')
  if (parts.length < 2) {
    return undefined
  }

  return parts.slice(-2).join('.')
}

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  const affiliateId = getCookie(event, 'affiliateId') || getCookie(event, 'promotekit_referral')
  const gaCookie = getCookie(event, '_ga')
  const clientId = getGaClientId(gaCookie)

  const query = new URLSearchParams({
    priceId: PriceEnum.AllAccessPass
  })

  if (affiliateId) {
    query.set('affiliateId', affiliateId)
  }

  if (clientId) {
    query.set('clientId', clientId)
  }

  const redirectPath = `/api/payments/redirect?${query.toString()}`

  if (!user) {
    setCookie(event, 'redirectPath', redirectPath, {
      path: '/',
      sameSite: 'lax'
    })
    return sendRedirect(event, '/login', 302)
  }

  return sendRedirect(event, redirectPath, 302)
})
