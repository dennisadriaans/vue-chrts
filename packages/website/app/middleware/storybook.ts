import { toast } from 'vue-sonner'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()

  // if (!import.meta.dev) {
  //   toast.error('You do not have permission to access this page')
  //   return navigateTo('/')
  // }

  const adminEmail = useRuntimeConfig().public.adminEmail
  if (!adminEmail || user?.value?.email !== adminEmail) {
    toast.error('You do not have permission to access this page')
    return navigateTo('/')
  }
})
