<script setup lang="ts">
/**
 * Component data - easily expandable for unique content per card
 */
const features = [
  {
    title: 'Premium Charts & Components',
    description: 'A clean library with hand crafted Vue components optimized for performance and designed to be pixel perfect.',
    img: '/card-image-4.svg',
    light: '/card-image-4-light.svg',
    icon: 'i-lucide-bar-chart-3',
    link: '/docs/components/overview'
  },
  {
    title: 'Charts for all types of data',
    description: 'Designed to handle high-density data with pixel-perfect precision. Ready to deploy.',
    img: '/card-image-5.svg',
    light: '/card-image-5-light.svg',
    icon: 'i-lucide-layout-template',
    link: '/docs/templates/dashboards'
  },
  {
    title: 'Extended UI Library',
    description: 'From KPI cards to advanced tables with sort and filter, we provide any data component you need.',
    img: '/card-image-6.svg',
    light: '/card-image-6-light.svg',
    icon: 'i-lucide-box',
    link: '/docs/components/blocks'
  },
  {
    title: 'All Access for Nuxt Developers',
    description: 'Unlock the full ecosystem including source files, private GitHub access, and priority updates tailored specifically for the Nuxt stack.',
    img: '/card-image-7.svg',
    light: '/card-image-7-light.svg',
    icon: 'i-lucide-unlock',
    link: '/pricing'
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
    <UCard
      v-for="(feature, index) in features"
      :key="index"
      variant="subtle"
      :ui="{
        root: 'group transition-all duration-300 rounded-2xl shadow mb-1',
        body: 'p-0 sm:p-0 md:p-0'
      }"
      :class="[
        index === 0 || index === 3 ? 'md:col-span-7' : 'md:col-span-5'
      ]"
    >
      <NuxtLink
        to="/blocks"
        class="flex flex-col h-full"
      >
        <div class="relative flex flex-col h-full">

          <DocsExamplesStatusTracker
            v-if="index === 0"
            class="overflow-hidden py-8 px-8 bg-muted dark:bg-default!"
          />

          <UCard
            v-if="index === 1"
            class="bg-muted py-1.5 dark:bg-default! "
          >

            <UCard>
              <HomeChartsCpuMonitoring />
            </UCard>
          </UCard>

          <UCard
            v-if="index === 2"
            class="bg-muted dark:bg-default!"
          >
            <UCard>
              <HomeExamplesProgress />
            </UCard>
          </UCard>

          <DocsExamplesCategoryDistribution
            v-if="index === 3"
            class="overflow-hidden py-12 px-8 bg-muted dark:bg-default!"
          />

          <div class="relative flex items-start justify-between gap-6 px-5 pt-6 pb-4 flex-1 bg-default dark:bg-elevated/10 rounded-bl-2xl rounded-br-2xl">
            <div class="space-y-2">
              <h3 class="text-xl font-semibold tracking-tight text-balance text-highlighted">
                {{ feature.title }}
              </h3>

              <p class="leading-relaxed text-dimmed">
                {{ feature.description }}
              </p>
            </div>

            <UButton
              color="neutral"
              variant="soft"
              size="xl"
              class="rounded-full shrink-0 transition-all duration-300 group-hover:scale-110 mt-0.5"
              aria-label="Expand feature"
            >
              <template #leading>
                <div class="relative w-5 h-5 flex items-center justify-center">
                  <UIcon
                    :name="feature.icon"
                    class="absolute w-5 h-5 transition-all duration-500 group-hover:opacity-0 group-hover:scale-0 group-hover:rotate-45"
                  />
                  <UIcon
                    name="i-hugeicons:arrow-up-right-01"
                    class="absolute w-5 h-5 opacity-0 scale-0 -rotate-45 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0"
                  />
                </div>
              </template>
            </UButton>
          </div>
        </div>
      </NuxtLink>
    </UCard>
  </div>
</template>
