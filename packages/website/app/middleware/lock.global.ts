export default defineNuxtRouteMiddleware((to) => {
  // Allow access to the unlock page and static assets
  if (to.path === '/unlock' || to.path.startsWith('/_nuxt/') || to.path.startsWith('/api/')) {
    return
  }

  // Only apply lock on the staging domain if possible, or if a lock code is set
  const config = useRuntimeConfig()
  const lockCode = config.public.lockCode

  if (!lockCode) {
    return
  }

  const cookie = useCookie('auth_code')
  if (cookie.value !== lockCode) {
    return navigateTo('/unlock')
  }
})
