import { toast } from 'vue-sonner'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()

  // if (!import.meta.dev) {
  //   toast.error('You do not have permission to access this page')
  //   return navigateTo('/')
  // }

  if (user?.value?.email !== 'adriaansendennis@gmail.com') {
    toast.error('You do not have permission to access this page')
    return navigateTo('/')
  }
})
