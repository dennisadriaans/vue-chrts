<script setup lang="ts">
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
    <div class="absolute -inset-y-32 left-1/2 -translate-x-1/2 w-[1800px] -z-10 pointer-events-none overflow-hidden">
      <svg
        class="w-full h-full stroke-(--ui-primary)/20 dark:stroke-(--ui-primary)/15 mask-[radial-gradient(100%_100%_at_0%_0%,white,transparent_80%)]"
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
        <line
          x1="12"
          y1="0"
          x2="55"
          y2="35"
          stroke-width="0.5"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>

    <div class="max-w-6xl mx-auto px-4 lg:px-0 space-y-12">
      <div class="flex flex-col lg:flex-row items-center justify-between w-full gap-4 text-center lg:text-left">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-balance max-w-lg">
          Data visualization built for Nuxt
        </h2>

        <div>
          <UButton
            label="Explore Everything"
            to="/blocks"
            color="neutral"
            variant="subtle"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Card 1 -->
        <UCard
          variant="subtle"
          :ui="{
            root: 'group transition-all duration-300 rounded-2xl shadow',
            body: 'p-0 sm:p-0 md:p-0 '
          }"
          class="lg:col-span-7"
        >
          <div class="flex flex-col h-full">
            <div class="relative flex flex-col h-full">
              <div
                class="dark:bg-default bg-muted flex items-center justify-center h-80 rounded-2xl overflow-hidden p-6 w-full"
                :style="getMaskStyle(0)"
              >
                <ClientOnly>
                  <HomeExamplesCategory />
                </ClientOnly>
              </div>

              <div class="relative flex items-start justify-between gap-6 px-5 pt-6 pb-4 flex-1 bg-default dark:bg-transparent rounded-bl-2xl rounded-br-2xl">
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold tracking-tight text-balance text-highlighted text-left">
                    Nuxt Native
                  </h3>
                  <p class="leading-relaxed text-dimmed text-left">
                    Optimized for Nuxt and Nuxt UI with auto-imports and full type safety for an exceptional developer experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Card 2 -->
        <UCard
          variant="subtle"
          :ui="{
            root: 'group transition-all duration-300 rounded-2xl shadow',
            body: 'p-0 sm:p-0 md:p-0'
          }"
          class="lg:col-span-5"
        >
          <div class="flex flex-col h-full">
            <div class="relative flex flex-col h-full">
              <div
                class="dark:bg-default bg-muted flex items-center justify-center h-80 rounded-2xl overflow-hidden p-6"
                :style="getMaskStyle(1)"
              >
                <UCard
                  variant="soft"
                  class="w-full bg-default rounded-xl"
                >
                  <HomeChartsCpuMonitoring />
                </UCard>
              </div>

              <div class="relative flex items-start justify-between gap-6 px-5 pt-6 pb-4 flex-1 bg-default dark:bg-transparent rounded-bl-2xl rounded-br-2xl">
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold tracking-tight text-balance text-highlighted text-left">
                    Reactive Animations
                  </h3>
                  <p class="leading-relaxed text-dimmed text-left">
                    Charts animate automatically when you update your ref or reactive state.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Card 3 -->
        <UCard
          variant="subtle"
          :ui="{
            root: 'group transition-all duration-300 rounded-2xl shadow mb-1',
            body: 'p-0 sm:p-0 md:p-0'
          }"
          class="lg:col-span-5"
        >
          <div class="flex flex-col h-full">
            <div class="relative flex flex-col h-full">
              <div
                class="flex items-center justify-center h-80 rounded-2xl overflow-hidden p-6"
              >
                <HomeExamplesProgress />
              </div>

              <div class="relative flex items-start justify-between gap-6 px-5 pt-6 pb-4 flex-1 bg-default dark:bg-transparent rounded-bl-2xl rounded-br-2xl">
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold tracking-tight text-balance text-highlighted text-left">
                    Unique Components
                  </h3>
                  <p class="leading-relaxed text-dimmed text-left">
                    Universal components with perfect server-side rendering and hydration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Card 4 -->
        <UCard
          variant="subtle"
          :ui="{
            root: 'group transition-all duration-300 rounded-2xl shadow mb-1',
            body: 'p-0 sm:p-0 md:p-0'
          }"
          class="lg:col-span-7"
        >
          <div class="flex flex-col h-full">
            <div class="relative flex flex-col h-full">
              <div
                class="dark:bg-default bg-muted flex items-center justify-center h-80 rounded-2xl overflow-hidden p-6"
                :style="getMaskStyle(3)"
              >
                <UCard
                  variant="soft"
                  class="w-full bg-default rounded-xl"
                >
                  <HomeChartsCardinal />
                </UCard>
              </div>

              <div class="relative flex items-start justify-between gap-6 px-5 pt-6 pb-4 flex-1 bg-default dark:bg-transparent rounded-bl-2xl rounded-br-2xl">
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold tracking-tight text-balance text-highlighted text-left">
                    Infinite ways to plot your data
                  </h3>
                  <p class="leading-relaxed text-dimmed text-left">
                    Choose from multiple Chart types to visualize your data with the perfect chart for every use case.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
