export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { proxy } = useScriptGoogleTagManager({
    id: config.public.googleTagManager,
    onBeforeGtmStart: (gtag) => {
      gtag('consent', 'default', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        ad_storage: 'granted',
        analytics_storage: 'granted',
        wait_for_update: 500
      })
    }
  })

  useScriptEventPage(({ title, path }) => {
    const colorMode = useColorMode()

    proxy.dataLayer.push({
      event: 'page_view',
      page_title: title,
      page_path: path,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      color_mode: colorMode.value
    })
  })
})
