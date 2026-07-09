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

const getSnippet = (curve: string, extra = '') => `
<AreaChart
  :data="data"
  :height="height"
  :categories="categories"
  :curve-type="CurveType.${curve}"
  :x-formatter="createXFormatter(data, 'x')"
  :legend-position="LegendPosition.BottomCenter"
  :hide-legend="false"
  :y-grid-line="true"
  :y-num-ticks="4"${extra}
/>`.trim()

const singleData = [
  { x: 'Jan', a: 2400 },
  { x: 'Feb', a: 3100 },
  { x: 'Mar', a: 2800 },
  { x: 'Apr', a: 3500 },
  { x: 'May', a: 4200 },
  { x: 'Jun', a: 3900 }
]
const singleCategories = computed(() => ({
  a: { name: 'Revenue', color: shades.value[2] }
}))

const dualData = [
  { x: 'W1', a: 30, b: 50 },
  { x: 'W2', a: 45, b: 60 },
  { x: 'W3', a: 55, b: 45 },
  { x: 'W4', a: 70, b: 80 },
  { x: 'W5', a: 60, b: 72 },
  { x: 'W6', a: 75, b: 90 }
]
const dualCategories = computed(() => ({
  a: { name: 'Organic', color: shades.value[1] },
  b: { name: 'Paid', color: shades.value[3] }
}))

const stackedData = [
  { x: 'Q1', a: 4200, b: 3100, c: 2400 },
  { x: 'Q2', a: 5800, b: 4200, c: 3800 },
  { x: 'Q3', a: 7200, b: 5500, c: 4100 },
  { x: 'Q4', a: 8100, b: 6200, c: 5200 }
]
const stackedCategories = computed(() => ({
  a: { name: 'Subscriptions', color: shades.value[0] },
  b: { name: 'Services', color: shades.value[2] },
  c: { name: 'Products', color: shades.value[4] }
}))

const stepData = [
  { x: '00:00', a: 45 },
  { x: '04:00', a: 38 },
  { x: '08:00', a: 72 },
  { x: '12:00', a: 85 },
  { x: '16:00', a: 68 },
  { x: '20:00', a: 52 }
]
const stepCategories = computed(() => ({
  a: { name: 'CPU Load', color: shades.value[3] }
}))

const naturalData = [
  { x: 'Mon', a: 120, b: 80 },
  { x: 'Tue', a: 150, b: 95 },
  { x: 'Wed', a: 135, b: 110 },
  { x: 'Thu', a: 180, b: 140 },
  { x: 'Fri', a: 195, b: 160 },
  { x: 'Sat', a: 160, b: 130 }
]
const naturalCategories = computed(() => ({
  a: { name: 'This Week', color: shades.value[2] },
  b: { name: 'Last Week', color: shades.value[0] }
}))

const linearData = [
  { x: '1', a: 20 },
  { x: '2', a: 45 },
  { x: '3', a: 35 },
  { x: '4', a: 60 },
  { x: '5', a: 52 },
  { x: '6', a: 75 },
  { x: '7', a: 68 }
]
const linearCategories = computed(() => ({
  a: { name: 'Visitors', color: shades.value[4] }
}))
</script>

<template>
  <div
    id="area"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold">
          Area Charts
        </h3>
        <p class="text-dimmed mt-1 text-sm">
          Filled regions showing trends and volume over time
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
      v-show="!showGallery"
      class="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <ChartGalleryCard
        title="Revenue Trend"
        :code="getSnippet('MonotoneX')"
      >
        <AreaChart
          :data="singleData"
          :height="height"
          :categories="singleCategories"
          :curve-type="CurveType.MonotoneX"
          :x-formatter="createXFormatter(singleData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :x-grid-line="false"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Organic vs Paid"
        :code="getSnippet('MonotoneX')"
      >
        <AreaChart
          :data="dualData"
          :height="height"
          :categories="dualCategories"
          :curve-type="CurveType.MonotoneX"
          :x-formatter="createXFormatter(dualData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="false"
          :x-grid-line="false"
          :y-domain-line="true"
          :x-domain-line="true"
          :y-num-ticks="5"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Revenue Streams"
        :code="getSnippet('Natural', '\n  stacked')"
      >
        <AreaChart
          :data="stackedData"
          :height="height"
          :categories="stackedCategories"
          :curve-type="CurveType.Natural"
          :x-formatter="createXFormatter(stackedData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-num-ticks="4"
          stacked
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Server Load"
        :code="getSnippet('Step')"
      >
        <AreaChart
          :data="stepData"
          :height="height"
          :categories="stepCategories"
          :curve-type="CurveType.Step"
          :x-formatter="createXFormatter(stepData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :x-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Weekly Comparison"
        :code="getSnippet('Natural')"
      >
        <AreaChart
          :data="naturalData"
          :height="height"
          :categories="naturalCategories"
          :curve-type="CurveType.Natural"
          :x-formatter="createXFormatter(naturalData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Daily Visitors"
        :code="getSnippet('Linear')"
      >
        <AreaChart
          :data="linearData"
          :height="height"
          :categories="linearCategories"
          :curve-type="CurveType.Linear"
          :x-formatter="createXFormatter(linearData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :x-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>
    </div>

    <!-- Gallery -->
    <div
      v-show="showGallery"
      class="mt-8"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChartGalleryCard
          title="Monotone Smooth"
          category="chart-gallery/area"
          block="monotone-smooth"
        >
          <ChartGalleryAreaMonotoneSmooth :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Digital Signal"
          category="chart-gallery/area"
          block="digital-signal"
        >
          <ChartGalleryAreaDigitalSignal :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Linear Clean"
          category="chart-gallery/area"
          block="linear-clean"
        >
          <ChartGalleryAreaLinearClean :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Monotone Engagement"
          category="chart-gallery/area"
          block="monotone-engagement"
        >
          <ChartGalleryAreaMonotoneEngagement :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Natural Basis Revenue"
          category="chart-gallery/area"
          block="natural-basis-revenue"
        >
          <ChartGalleryAreaNaturalBasisRevenue :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Step After Multi Metrics"
          category="chart-gallery/area"
          block="step-after-multi-metrics"
        >
          <ChartGalleryAreaStepAfterMultiMetrics :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Gray Area - Monotone"
          category="chart-gallery/themes/monochrome"
          block="mono-area"
        >
          <ChartGalleryThemesMonochromeMonoArea :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Electric Green - Spike"
          category="chart-gallery/themes/neon-glow"
          block="neon-area"
        >
          <ChartGalleryThemesNeonGlowNeonArea :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Rose & Lavender Waves"
          category="chart-gallery/themes/pastel-dreams"
          block="pastel-area"
        >
          <ChartGalleryThemesPastelDreamsPastelArea :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Fire & Ice Collision"
          category="chart-gallery/themes/bold-contrast"
          block="bold-area"
        >
          <ChartGalleryThemesBoldContrastBoldArea :height="height" />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
