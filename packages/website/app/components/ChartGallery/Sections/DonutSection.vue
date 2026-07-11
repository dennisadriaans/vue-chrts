<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const { paletteOptions: basePaletteOptions, generateShades } = useChartPalette()
const paletteOptions = computed(() => [
  ...basePaletteOptions,
  { label: 'Multi colors', value: 'multi' }
])
const selectedPalette = ref(paletteOptions.value[paletteOptions.value.length - 1]!.value)
const shades = computed(() => generateShades(selectedPalette.value, 5))
const showGallery = ref(true)

watch(selectedPalette, (newVal) => {
  if (newVal === 'multi') {
    showGallery.value = true
  } else {
    showGallery.value = false
  }
})

watch(showGallery, (newVal) => {
  if (newVal) {
    selectedPalette.value = 'multi'
  } else if (selectedPalette.value === 'multi') {
    selectedPalette.value = paletteOptions.value[0]!.value
  }
})

const getSnippet = (type: string) => `
<DonutChart
  :data="data"
  :height="height"
  :categories="categories"
  :legend-position="LegendPosition.BottomCenter"
  :hide-legend="false"
  :type="DonutType.${type}"
/>`.trim()

const threeSegData = [45, 30, 25]
const threeSegCategories = computed(() => ({
  a: { name: 'Product', color: shades.value[1] },
  b: { name: 'Services', color: shades.value[2] },
  c: { name: 'Support', color: shades.value[4] }
}))

const fourSegData = [40, 25, 20, 15]
const fourSegCategories = computed(() => ({
  a: { name: 'Desktop', color: shades.value[0] },
  b: { name: 'Mobile', color: shades.value[1] },
  c: { name: 'Tablet', color: shades.value[3] },
  d: { name: 'Other', color: shades.value[4] }
}))

const fiveSegData = [35, 25, 20, 12, 8]
const fiveSegCategories = computed(() => ({
  a: { name: 'Chrome', color: shades.value[0] },
  b: { name: 'Firefox', color: shades.value[1] },
  c: { name: 'Safari', color: shades.value[2] },
  d: { name: 'Edge', color: shades.value[3] },
  e: { name: 'Other', color: shades.value[4] }
}))

const halfData = [60, 25, 15]
const halfCategories = computed(() => ({
  a: { name: 'Completed', color: shades.value[1] },
  b: { name: 'In Progress', color: shades.value[3] },
  c: { name: 'Pending', color: shades.value[0] }
}))

const progressData = [72, 28]
const progressCategories = computed(() => ({
  a: { name: 'Progress', color: shades.value[2] },
  b: { name: 'Remaining', color: shades.value[0] }
}))

const twoSegData = [65, 35]
const twoSegCategories = computed(() => ({
  a: { name: 'Active', color: shades.value[3] },
  b: { name: 'Inactive', color: shades.value[0] }
}))
</script>

<template>
  <div
    id="donut"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold">
          Donut Charts
        </h3>
        <p class="text-dimmed mt-1 text-sm">
          Part-to-whole relationships and percentage breakdowns
        </p>
      </div>
      <div class="flex items-center gap-2">
        <USelect
          v-model="selectedPalette"
          :items="paletteOptions"
          value-key="value"
          class="w-36"
        />
      </div>
    </div>

    <div
      v-if="!showGallery"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <ChartGalleryCard
        title="Revenue Split"
        :code="getSnippet('Full')"
      >
        <div class="flex items-center justify-center py-4">
          123
          <DonutChart
            :data="threeSegData"
            :height="160"
            :categories="threeSegCategories"
            :legend-position="LegendPosition.BottomCenter"
            :hide-legend="false"
            :radius="0"
            :type="DonutType.Full"
          >
            <div class="text-center">
              <div class="text-2xl font-bold">
                45%
              </div>
              <div class="text-dimmed text-xs">
                Product
              </div>
            </div>
          </DonutChart>
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Device Share"
        :code="getSnippet('Full')"
      >
        <div class="flex items-center justify-center py-4">
          <DonutChart
            :data="fourSegData"
            :height="160"
            :categories="fourSegCategories"
            :legend-position="LegendPosition.BottomCenter"
            :hide-legend="false"
            :radius="0"
            :type="DonutType.Full"
          >
            <div class="text-center">
              <div class="text-2xl font-bold">
                40%
              </div>
              <div class="text-dimmed text-xs">
                Desktop
              </div>
            </div>
          </DonutChart>
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Browser Usage"
        :code="getSnippet('Full')"
      >
        <div class="flex items-center justify-center py-4">
          <DonutChart
            :data="fiveSegData"
            :height="160"
            :categories="fiveSegCategories"
            :legend-position="LegendPosition.BottomCenter"
            :hide-legend="false"
            :radius="0"
            :type="DonutType.Full"
          >
            <div class="text-center">
              <div class="text-2xl font-bold">
                35%
              </div>
              <div class="text-dimmed text-xs">
                Chrome
              </div>
            </div>
          </DonutChart>
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Task Status"
        :code="getSnippet('Half')"
      >
        <div class="flex items-center justify-center py-4">
          <DonutChart
            :data="halfData"
            :height="140"
            :categories="halfCategories"
            :legend-position="LegendPosition.BottomCenter"
            :hide-legend="false"
            :radius="0"
            :type="DonutType.Half"
          >
            <div class="text-center mt-16">
              <div class="text-2xl font-bold">
                60%
              </div>
            </div>
          </DonutChart>
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Progress Ring"
        :code="getSnippet('Full')"
      >
        <div class="flex items-center justify-center py-4">
          <DonutChart
            :data="progressData"
            :height="160"
            :categories="progressCategories"
            :legend-position="LegendPosition.BottomCenter"
            :hide-legend="false"
            :radius="0"
            :type="DonutType.Full"
          >
            <div class="text-center">
              <div class="text-3xl font-bold">
                72%
              </div>
            </div>
          </DonutChart>
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Active vs Inactive"
        :code="getSnippet('Full')"
      >
        <div class="flex items-center justify-center py-4">
          <DonutChart
            :data="twoSegData"
            :height="160"
            :categories="twoSegCategories"
            :legend-position="LegendPosition.BottomCenter"
            :hide-legend="false"
            :radius="0"
            :type="DonutType.Full"
          >
            <div class="text-center">
              <div class="text-2xl font-bold">
                65%
              </div>
              <div class="text-dimmed text-xs">
                Active
              </div>
            </div>
          </DonutChart>
        </div>
      </ChartGalleryCard>
    </div>

    <!-- Gallery -->
    <div
      v-if="showGallery"
      class="mt-8"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChartGalleryCard
          title="Aurora Borealis"
          category="chart-gallery/donut"
          block="aurora-borealis"
        >
          <ChartGalleryDonutAuroraBorealis :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Browser Share"
          category="chart-gallery/donut"
          block="browser-share"
        >
          <ChartGalleryDonutBrowserShare :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Citrus Splash"
          category="chart-gallery/donut"
          block="citrus-splash"
        >
          <ChartGalleryDonutCitrusSplash :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Forest Canopy"
          category="chart-gallery/donut"
          block="forest-canopy"
        >
          <ChartGalleryDonutForestCanopy :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Golden Hour"
          category="chart-gallery/donut"
          block="golden-hour"
        >
          <ChartGalleryDonutGoldenHour :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Midnight Blues"
          category="chart-gallery/donut"
          block="midnight-blues"
        >
          <ChartGalleryDonutMidnightBlues :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Purple Spectrum"
          category="chart-gallery/donut"
          block="purple-spectrum"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutPurpleSpectrum />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Success Ring"
          category="chart-gallery/donut"
          block="success-ring"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutSuccessRing />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Priority Levels"
          category="chart-gallery/donut"
          block="priority-levels"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutPriorityLevels />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Sunset Gradient"
          category="chart-gallery/donut"
          block="sunset-gradient"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutSunsetGradient />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Ocean Depths"
          category="chart-gallery/donut"
          block="ocean-depths"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutOceanDepths />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Royal Purple"
          category="chart-gallery/donut"
          block="royal-purple"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutRoyalPurple />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Rose Petal"
          category="chart-gallery/donut"
          block="rose-petal"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutRosePetal />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Monochrome"
          category="chart-gallery/donut"
          block="monochrome"
        >
          <div class="flex items-center justify-center py-4">
            <ChartGalleryDonutMonochrome />
          </div>
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Progress Ring"
          category="chart-gallery/themes/monochrome"
          block="mono-donut"
        >
          <ChartGalleryThemesMonochromeMonoDonut :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Neon Spectrum"
          category="chart-gallery/themes/neon-glow"
          block="neon-donut"
        >
          <ChartGalleryThemesNeonGlowNeonDonut :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Soft Segments"
          category="chart-gallery/themes/pastel-dreams"
          block="pastel-donut"
        >
          <ChartGalleryThemesPastelDreamsPastelDonut :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Yin Yang Balance"
          category="chart-gallery/themes/bold-contrast"
          block="bold-donut"
        >
          <ChartGalleryThemesBoldContrastBoldDonut :height="height" />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
