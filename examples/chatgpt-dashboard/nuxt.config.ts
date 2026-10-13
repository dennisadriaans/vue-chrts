export default defineNuxtConfig({
  modules: ['nuxt-charts'],
  compatibilityDate: '2025-04-08',
  app: {
    head: {
      title: 'Nuxt Charts · ChatGPT Dashboard',
      meta: [{ name: 'description', content: 'Interactive mock analytics dashboard built with Nuxt Charts v3' }]
    }
  }
})
