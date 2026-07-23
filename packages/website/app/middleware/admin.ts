import { toast } from 'vue-sonner'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useUserSession()
  if (!loggedIn.value && !import.meta.dev) {
    const redirectCookie = useCookie('redirectPath')
    redirectCookie.value = to.fullPath
    toast.error('You must be logged in to access the app')
    return navigateTo('/login')
  }

  // Check if accessing /admin/** routes.
  // This is UI-level gating only — every /api/admin/** route re-checks the
  // admin identity server-side, so a bypass here grants no privileged access.
  if (to.path.startsWith('/admin/')) {
    const adminEmail = useRuntimeConfig().public.adminEmail
    if (!adminEmail || user.value?.email !== adminEmail) {
      toast.error('You do not have permission to access this page')
      return navigateTo('/')
    }
  }
})
