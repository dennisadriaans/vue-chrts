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
    <header class="relative px-4 pt-44 pb-24 lg:pt-52 lg:pb-18">
      <div
        class="absolute inset-0 hidden items-center justify-center lg:top-16 dark:flex -z-10"
      >
        <div
          class="absolute h-150 w-100 rounded-full opacity-60 blur-3xl lg:h-200 lg:w-300 -z-10"
          style="
            background: radial-gradient(
              circle,
              rgba(5, 223, 114, 0.15) 0%,
              rgba(5, 223, 114, 0.08) 50%,
              rgba(5, 223, 114, 0.05) 100%
            );
          "
        />
      </div>

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
        class=" px-8 lg:px-0 dark:text-muted relative z-10 mx-auto mt-3 lg:mt-6 max-w-xl text-center lg:text-lg text-pretty sm:text-xl/8"
      >
        Modern Vue charts and components to build beautiful dashboards. Built with Tailwind CSS and Nuxt UI.
      </p>

      <div class="relative z-10 mt-6 flex flex-col items-center justify-center gap-4 lg:flex-row">
        <UButton
          variant="soft"
          size="md"
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
            size="md"
            trailing-icon="i-hugeicons:arrow-right-02"
            @click="useButtonTracking().trackSelectContent('navigation', 'view_all_blocks')"
          >
            View blocks
          </UButton>
        </NuxtLink>
      </div>
    </header>

    <!-- <CanvasNetworkBackground /> -->

    <!-- Logo Banner -->
    <div class="relative mx-auto max-w-screen-2xl pt-24 lg:pt-6 lg:pb-12">
      <div class="relative z-10 mx-auto max-w-3xl">
        <LogoBanner />
      </div>
      <div class="dot-pattern absolute inset-0" />
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
          container: 'max-w-4xl mx-auto py-16 sm:py-24 lg:py-24'
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

<style>
.dot-pattern {
  position: absolute;

  background-image: radial-gradient(var(--dot-pattern-color) 1px,
      transparent 1px);
  background-size: 9px 9px;
  background-position: -8.5px -8.5px;
  opacity: 100%;

  mask-image: radial-gradient(ellipse at center,
      rgba(0, 0, 0, 1),
      transparent 75%);
}
</style>
