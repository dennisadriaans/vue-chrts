export default defineNuxtRouteMiddleware((to) => {
  const affiliateId = to.query.via || to.query.ref
  if (affiliateId) {
    const affiliateCookie = useCookie('affiliateId', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })
    affiliateCookie.value = Array.isArray(affiliateId) ? affiliateId[0] : affiliateId as string
  }
})
