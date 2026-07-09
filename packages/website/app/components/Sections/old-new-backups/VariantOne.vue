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

const maskGradients = [
  'radial-gradient(67.78% 58.09% at 24.12% 46.87%, #000 30%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.91) 38%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.78) 46%, rgba(0,0,0,0.71) 50%, rgba(0,0,0,0.63) 54%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.47) 62%, rgba(0,0,0,0.39) 66%, rgba(0,0,0,0.31) 70%, rgba(0,0,0,0.24) 74%, rgba(0,0,0,0.17) 78%, rgba(0,0,0,0.11) 82%, rgba(0,0,0,0.06) 86%, rgba(0,0,0,0.03) 90%, rgba(0,0,0,0.01) 94%, transparent 100%)',
  'radial-gradient(circle, #000 30%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.91) 38%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.78) 46%, rgba(0,0,0,0.71) 50%, rgba(0,0,0,0.63) 54%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.47) 62%, rgba(0,0,0,0.39) 66%, rgba(0,0,0,0.31) 70%, rgba(0,0,0,0.24) 74%, rgba(0,0,0,0.17) 78%, rgba(0,0,0,0.11) 82%, rgba(0,0,0,0.06) 86%, rgba(0,0,0,0.03) 90%, rgba(0,0,0,0.01) 94%, transparent 100%)',
  'linear-gradient(to right, #000 30%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.91) 38%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.78) 46%, rgba(0,0,0,0.71) 50%, rgba(0,0,0,0.63) 54%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.47) 62%, rgba(0,0,0,0.39) 66%, rgba(0,0,0,0.31) 70%, rgba(0,0,0,0.24) 74%, rgba(0,0,0,0.17) 78%, rgba(0,0,0,0.11) 82%, rgba(0,0,0,0.06) 86%, rgba(0,0,0,0.03) 90%, rgba(0,0,0,0.01) 94%, transparent 100%)',
  'radial-gradient(67.78% 58.09% at 14.12% 46.87%, #000 50%, rgba(0,0,0,0.97) 53%, rgba(0,0,0,0.93) 56%, rgba(0,0,0,0.88) 59%, rgba(0,0,0,0.83) 62%, rgba(0,0,0,0.77) 65%, rgba(0,0,0,0.71) 68%, rgba(0,0,0,0.65) 71%, rgba(0,0,0,0.59) 74%, rgba(0,0,0,0.54) 77%, rgba(0,0,0,0.49) 80%, rgba(0,0,0,0.46) 83%, rgba(0,0,0,0.44) 86%, rgba(0,0,0,0.42) 89%, rgba(0,0,0,0.41) 93%, rgba(0,0,0,0.4) 100%)'
]

const colorMode = useColorMode()
function getMaskStyle(index: number) {
  if (colorMode.value !== 'dark') return {}
  const order = [0, 1, 2, 3] // card 0, 1, 2, 3 → gradient 0, 1, 2, 3
  return { maskImage: maskGradients[order[index]], WebkitMaskImage: maskGradients[order[index]] }
}
</script>

<template>
  <div class="relative space-y-12 overflow-hidden">
    <div class="relative z-10 max-w-6xl mx-auto space-y-12">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-8 md:gap-0 px-4 md:px-0">
        <h2 class="w-full md:w-1/2 text-4xl md:text-5xl font-semibold tracking-tight text-balance max-w-xs">
          Made for Nuxt Developers
        </h2>

        <p class="w-full md:w-1/2 text-lg text-muted leading-relaxed">
          Stop struggling with UI details. Nuxt Charts provides the components. You ship a pixel-perfect project.
        </p>
      </div>

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

              <div
                class="dark:bg-default bg-muted flex items-center h-64 rounded-2xl overflow-hidden"
                :style="getMaskStyle(index)"
              >
                <img
                  :src="feature.light || feature.img"
                  alt=""
                  class="w-full pl-6 object-contain object-left h-full block dark:hidden"
                >
                <img
                  :src="feature.img"
                  alt=""
                  class="w-full pl-6 object-contain object-left h-full hidden dark:block"
                >
              </div>

              <div class="relative flex items-start justify-between gap-6 px-5 pt-6 pb-4 flex-1 bg-default dark:bg-transparent rounded-bl-2xl rounded-br-2xl">
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
    </div>
  </div>
</template>
