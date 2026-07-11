<script lang="ts" setup>
import { motion } from 'motion-v'

useSeoMeta({
  title: 'Beautiful Chart Library for Vue | Nuxt Charts',
  ogTitle: 'Beautiful Chart Library for Vue | Nuxt Charts',
  description:
    'Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.',
  ogDescription:
    'Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.',
  ogImage: 'https://nuxtcharts.com/images/home.png',
  ogImageUrl: 'https://nuxtcharts.com/images/home.png',
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Beautiful Chart Library for Vue | Nuxt Charts',
  twitterDescription:
    'Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.',
  twitterImage: 'https://nuxtcharts.com/images/home.png',
  twitterImageAlt: 'Beautiful Chart Library for Vue | Nuxt Charts',
  twitterCreator: '@DennisAdriaans',
  keywords: 'nuxt charts, vue charts, charts for nuxt, vue chart library, unovis, d3 charts vue'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://nuxtcharts.com'
    }
  ]
})

const copyToClipboard = () => {
  navigator.clipboard.writeText('npx nuxi@latest module add nuxt-charts')

  const { trackSelectContent } = useButtonTracking()
  trackSelectContent('cli_command', 'install_nuxt_charts')

  useToast().add({
    title: 'Copied to clipboard',
    description: 'Ready to paste!',
    icon: 'i-heroicons-check-circle'
  })
}

const isLg = ref(false)

const updateBreakpoint = () => {
  isLg.value = window.innerWidth >= 1024
}

onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint)

  // setTimeout(() => {
  //   startScroll()
  // }, 5000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBreakpoint)
})
</script>

<template>
  <div class="relative">
    <div class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div class="hero-grid-lines absolute inset-0"></div>
        <div class="hero-grid-cells absolute inset-0"></div>
      </div>

      <header class="relative z-10 px-4 pt-44 pb-24 lg:pt-52 lg:pb-18">
        <div class="relative z-10 mb-8 flex items-center justify-center">
          <Logo />
        </div>

        <h1
          class="text-highlighted mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight lg:text-7xl text-pretty"
        >
          Create beautiful
          <span>charts</span> with Vue and
          <span class="text-primary">Nuxt</span>
        </h1>
        <p
          class=" px-8 lg:px-0 dark:text-muted relative z-10 mx-auto mt-3 lg:mt-8 max-w-xl text-center lg:text-xl text-pretty sm:text-xl/8"
        >
          Modern Vue charts and components to build beautiful dashboards. Built with Tailwind CSS and Nuxt UI.
        </p>

        <div class="relative z-10 mt-16 flex flex-col items-center justify-center gap-4 lg:flex-row">
          <UButton
            variant="soft"
            size="xl"
            color="primary"
            trailing-icon="i-hugeicons:copy-01"
            @click="copyToClipboard"
          >
            npx nuxi@latest module add nuxt-charts
          </UButton>

          <NuxtLink to="/blocks">
            <UButton
              color="neutral"
              class="cursor-pointer"
              size="xl"
              trailing-icon="i-hugeicons:arrow-right-02"
              @click="useButtonTracking().trackSelectContent('navigation', 'view_all_blocks')"
            >
              View blocks
            </UButton>
          </NuxtLink>
        </div>
      </header>

      <div class="relative z-10 mx-auto max-w-screen-2xl pt-24 lg:pt-6 lg:pb-12">
        <div class="mx-auto max-w-3xl">
          <LogoBanner />
        </div>
      </div>
    </div>

    <!-- <UPageSection
      :ui="{
        container: 'py-16 sm:py-24 lg:py-24'
      }"
    >
      <SectionsIntroNew class="w-full" />
    </UPageSection> -->

    <!-- Chart Cards -->
    <motion.div
      :initial="{
        opacity: 0,
        transform: 'translateY(5%)'
      }"
      :animate="{
        opacity: 1,
        transform: 'translateY(0%)'
      }"
      :transition="{
        duration: 1,
        delay: 0.8
      }"
    >
      <UPageSection
        :ui="{
          container: 'max-w-8xl mx-auto mb-16 py-8 sm:py-8 lg:py-8 bg-elevated/10'
        }"
      >
        <HomeChartCardsWrapper />
      </UPageSection>
    </motion.div>

    <UPageLogos
      marquee
      title="To be part of an amazing ecosystem"
      class="mx-auto mb-24 max-w-4xl"
      :items="[
        'i-simple-icons-tailwindcss',
        'i-simple-icons-nuxt',
        'i-simple-icons-vercel',
        'i-simple-icons-unjs',
        'i-simple-icons-sqlite',
        'i-simple-icons-prettier'
      ]"
    />

    <div>
      <UPageSection
        headline="Pixel perfect design"
        title="Customize every detail"
        description="Customize every tiny detail with Vue Charts and data components for Vue and Nuxt."
        :ui="{
        }"
      >
        <SectionsGrid />
      </UPageSection>

      <UPageSection
        title="Beautiful Data Components"
        description="Skip 40+ hours of UI work. Drop in production-ready components and ship before the end of the week."
        :ui="{
          container: 'py-16 sm:py-24 lg:py-24'
        }"
      >
        <SectionsGridThreeCol />
      </UPageSection>

      <!-- Testimonials Section -->
      <UPageSection
        headline="Don't Just Take My Word For It..."
        title="See What the Others Are Saying"
        description="Trusted by Nuxt developers shipping real products."
      >
        <TestimonialsGrid />
      </UPageSection>

      <div class="relative overflow-hidden">
        <SectionsTemplates />
      </div>

      <UPageSection
        title="Ready to build something amazing?"
        :ui="{
          title: 'max-w-2xl lg:text-6xl mx-auto',
          description: 'max-w-2xl mx-auto'
        }"
        :links="[

          {
            label: 'Explore templates',
            to: '/templates',
            color: 'primary',
            trailingIcon: 'i-lucide-arrow-right'
          }
        ]"
      />
    </div>
  </div>
</template>
