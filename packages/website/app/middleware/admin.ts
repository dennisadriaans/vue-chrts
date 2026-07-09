import { toast } from 'vue-sonner'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useUserSession()
  if (!loggedIn.value && !import.meta.dev) {
    const redirectCookie = useCookie('redirectPath')
    redirectCookie.value = to.fullPath
    toast.error('You must be logged in to access the app')
    return navigateTo('/login')
  }

  // Check if accessing /admin/** routes
  // NOTE: Admin email is hardcoded per requirements
  // Future: Consider using role-based permission system or environment variable
  if (to.path.startsWith('/admin/')) {
    if (user.value?.email !== 'adriaansendennis@gmail.com') {
      toast.error('You do not have permission to access this page')
      return navigateTo('/')
    }
  }
})
