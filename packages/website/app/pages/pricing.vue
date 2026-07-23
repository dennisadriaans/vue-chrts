<script lang="ts" setup>
useSeoMeta({
  title: 'Nuxt Charts Pricing - Affordable Data Visualization for Nuxt',
  ogTitle: 'Nuxt Charts Pricing - Plans & Features for Nuxt Applications',
  description:
    'Discover Nuxt Charts pricing plans. Get powerful, interactive data visualization for your Nuxt applications with flexible and affordable options tailored for every project size.',
  ogDescription:
    'Find the perfect Nuxt Charts plan for your project. Explore our pricing, features, and how Nuxt Charts offers an affordable and robust charting solution for Nuxt developers.',
  ogImage: 'https://nuxtcharts.com/images/og/home.png',
  ogImageUrl: 'https://nuxtcharts.com/images/og/home.png', // Keep your actual image URL
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Nuxt Charts Pricing - Start Visualizing Your Data Today!',
  twitterDescription:
    'Explore flexible and affordable pricing for Nuxt Charts. Integrate beautiful, interactive charts into your Nuxt applications with ease. View our plans and features.',
  twitterImage:
    'https://nuxtcharts.com/images/og/home.png', // Keep your actual image URL
  keywords: 'nuxt charts pricing, nuxt charts pro, vue charts license'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://nuxtcharts.com/pricing'
    }
  ]
})
</script>

<template>
  <div class="py-8">
    <div class="relative overflow-hidden">
      <div class="absolute -inset-y-32 left-1/2 -translate-x-1/2 w-[1800px] -z-10 pointer-events-none overflow-hidden">
        <svg
          class="w-full h-full stroke-[var(--ui-primary)]/20 dark:stroke-[var(--ui-primary)]/15 [mask-image:radial-gradient(100%_100%_at_top_left,white,transparent_80%)]"
          fill="none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="5"
            x2="45"
            y2="40"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
          />
          <line
            x1="5"
            y1="0"
            x2="50"
            y2="35"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <UPageSection
        headline="Pricing"
        title="Make It Yours Today"
        description="Get access to all premium blocks, templates, components, and free future updates."
      >
        <Priceplans />
      </UPageSection>
    </div>

    <UPageSection
      headline="Don't Just Take My Word For It..."
      title="See What the Others Are Saying"
      description="Join Successful Nuxt developers who have chosen Nuxt Charts"
      class="-mt-16"
    >
      <TestimonialsGrid />
    </UPageSection>
  </div>
</template>
