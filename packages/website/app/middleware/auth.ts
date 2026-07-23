export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    const redirectCookie = useCookie('redirectPath')
    redirectCookie.value = to.fullPath
    return navigateTo('/login')
  }
})
