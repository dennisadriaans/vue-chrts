import { PriceEnum } from '~~/utils/ProductMap'

export const nuxtApplicationThemeContent = {
  priceKey: PriceEnum.NuxtApplicationTheme,
  seo: {
    title: 'Nuxt Application Theme - Modern Nuxt UI Template',
    description: 'A comprehensive application theme for Nuxt. Perfect for building modern web applications with Nuxt UI.',
    ogTitle: 'Nuxt Application Theme - Modern Nuxt UI Template',
    ogDescription: 'A comprehensive application theme for Nuxt. Perfect for building modern web applications with Nuxt UI.',
    ogImageUrl: 'https://nuxtcharts.com/images/nuxt-application-theme/og.png',
    ogImageType: 'image/png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle: 'Nuxt Application Theme - Modern Nuxt UI Template',
    twitterDescription: 'A comprehensive application theme for Nuxt. Perfect for building modern web applications with Nuxt UI.',
    twitterImage: 'https://nuxtcharts.com/images/nuxt-application-theme/og.png',
    twitterImageAlt: 'Nuxt Application Theme - Modern Nuxt UI Template',
    twitterCreator: '@DennisAdriaans'
  },
  hero: {
    heading: 'Nuxt Application Theme',
    subheading: 'A comprehensive application theme for Nuxt. Designed for building modern, responsive web applications.',
    cta: {
      label: 'Buy Now for $99',
      icon: 'i-lucide-download',
      disabled: false
    },
    demoCta: {
      label: 'View Demo',
      icon: 'i-lucide-monitor-speaker',
      href: 'https://nuxt-application-theme-demo.nuxtcharts.com'
    },
    badges: ['Vue 3', 'Nuxt 3', 'TypeScript', 'Tailwind CSS', 'Nuxt UI']
  },
  banner: '/images/nuxt-application-theme/banner.png',
  stats: [
    {
      value: 'New',
      label: 'Release',
      icon: 'i-lucide-star'
    },
    {
      value: '100+',
      label: 'Components',
      icon: 'i-lucide-box'
    },
    {
      value: 'Modern',
      label: 'Nuxt UI',
      icon: 'i-lucide-palette'
    }
  ]
}
