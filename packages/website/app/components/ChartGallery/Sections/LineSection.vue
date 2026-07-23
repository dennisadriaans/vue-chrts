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

const getSnippet = (curve: string) => `
<LineChart
  :data="data"
  :height="height"
  :categories="categories"
  :curve-type="CurveType.${curve}"
  :x-formatter="createXFormatter(data, 'x')"
  :legend-position="LegendPosition.BottomCenter"
  :hide-legend="false"
  :y-grid-line="true"
  :y-num-ticks="4"
/>`.trim()

const singleData = [
  { x: 'Jan', a: 42 },
  { x: 'Feb', a: 58 },
  { x: 'Mar', a: 51 },
  { x: 'Apr', a: 73 },
  { x: 'May', a: 68 },
  { x: 'Jun', a: 82 }
]
const singleCategories = computed(() => ({
  a: { name: 'Price', color: shades.value[2] }
}))

const dualData = [
  { x: 'Jan', a: 4500, b: 3200 },
  { x: 'Feb', a: 5200, b: 3800 },
  { x: 'Mar', a: 4800, b: 4100 },
  { x: 'Apr', a: 6100, b: 4500 },
  { x: 'May', a: 5800, b: 5200 },
  { x: 'Jun', a: 7200, b: 5800 }
]
const dualCategories = computed(() => ({
  a: { name: 'Revenue', color: shades.value[1] },
  b: { name: 'Expenses', color: shades.value[3] }
}))

const tripleData = [
  { x: 'W1', a: 120, b: 850, c: 12 },
  { x: 'W2', a: 98, b: 920, c: 8 },
  { x: 'W3', a: 115, b: 880, c: 15 },
  { x: 'W4', a: 88, b: 980, c: 5 },
  { x: 'W5', a: 92, b: 1020, c: 7 },
  { x: 'W6', a: 105, b: 950, c: 10 }
]
const tripleCategories = computed(() => ({
  a: { name: 'Latency', color: shades.value[0] },
  b: { name: 'Throughput', color: shades.value[2] },
  c: { name: 'Errors', color: shades.value[4] }
}))

const stepData = [
  { x: '00:00', a: 32 },
  { x: '04:00', a: 28 },
  { x: '08:00', a: 65 },
  { x: '12:00', a: 78 },
  { x: '16:00', a: 72 },
  { x: '20:00', a: 45 }
]
const stepCategories = computed(() => ({
  a: { name: 'CPU %', color: shades.value[3] }
}))

const smoothData = [
  { x: 'Jan', a: 100, b: 80 },
  { x: 'Feb', a: 180, b: 120 },
  { x: 'Mar', a: 250, b: 190 },
  { x: 'Apr', a: 340, b: 280 },
  { x: 'May', a: 420, b: 350 },
  { x: 'Jun', a: 510, b: 430 }
]
const smoothCategories = computed(() => ({
  a: { name: 'New Users', color: shades.value[1] },
  b: { name: 'Returning', color: shades.value[4] }
}))

const channelData = [
  { x: 'Jan', a: 320, b: 210, c: 150 },
  { x: 'Feb', a: 380, b: 250, c: 180 },
  { x: 'Mar', a: 350, b: 290, c: 210 },
  { x: 'Apr', a: 420, b: 310, c: 240 },
  { x: 'May', a: 480, b: 340, c: 260 },
  { x: 'Jun', a: 520, b: 380, c: 290 }
]
const channelCategories = computed(() => ({
  a: { name: 'Direct', color: shades.value[0] },
  b: { name: 'Referral', color: shades.value[2] },
  c: { name: 'Social', color: shades.value[4] }
}))
</script>

<template>
  <div
    id="line"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold">
          Line Charts
        </h3>
        <p class="text-dimmed mt-1 text-sm">
          Smooth curves, trends, and multi-series comparisons
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
      class="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <ChartGalleryCard
        title="Stock Price"
        :code="getSnippet('MonotoneX')"
      >
        <LineChart
          :data="singleData"
          :height="height"
          :categories="singleCategories"
          :curve-type="CurveType.MonotoneX"
          :x-formatter="createXFormatter(singleData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Revenue vs Expenses"
        :code="getSnippet('Cardinal')"
      >
        <LineChart
          :data="dualData"
          :height="height"
          :categories="dualCategories"
          :curve-type="CurveType.Cardinal"
          :x-formatter="createXFormatter(dualData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Performance Metrics"
        :code="getSnippet('CatmullRom')"
      >
        <LineChart
          :data="tripleData"
          :height="height"
          :categories="tripleCategories"
          :curve-type="CurveType.CatmullRom"
          :x-formatter="createXFormatter(tripleData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="CPU Monitoring"
        :code="getSnippet('StepAfter')"
      >
        <LineChart
          :data="stepData"
          :height="height"
          :categories="stepCategories"
          :curve-type="CurveType.StepAfter"
          :x-formatter="createXFormatter(stepData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :x-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="User Growth"
        :code="getSnippet('Natural')"
      >
        <LineChart
          :data="smoothData"
          :height="height"
          :categories="smoothCategories"
          :curve-type="CurveType.Natural"
          :x-formatter="createXFormatter(smoothData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Sales Channels"
        :code="getSnippet('Linear')"
      >
        <LineChart
          :data="channelData"
          :height="height"
          :categories="channelCategories"
          :curve-type="CurveType.Linear"
          :x-formatter="createXFormatter(channelData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :y-domain-line="true"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>
    </div>

    <!-- Gallery -->
    <div
      v-if="showGallery"
      class="mt-8"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChartGalleryCard
          title="Cardinal Performance"
          category="chart-gallery/line"
          block="cardinal-performance"
        >
          <ChartGalleryLineCardinalPerformance :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Minimal Linear Stock"
          category="chart-gallery/line"
          block="minimal-linear-stock"
        >
          <ChartGalleryLineMinimalLinearStock :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Natural Growth Curve"
          category="chart-gallery/line"
          block="natural-growth-curve"
        >
          <ChartGalleryLineNaturalGrowthCurve :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Step Server Uptime"
          category="chart-gallery/line"
          block="step-server-uptime"
        >
          <ChartGalleryLineStepServerUptime :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Green Growth Natural"
          category="chart-gallery/line/elegant"
          block="green-growth-natural-curve"
        >
          <ChartGalleryLineElegantGreenGrowthNaturalCurve :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Stock Tracker"
          category="chart-gallery/line/elegant"
          block="stock-tracker-catmull-rom"
        >
          <ChartGalleryLineElegantStockTrackerCatmullRom :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Dual Tone Lines"
          category="chart-gallery/themes/monochrome"
          block="mono-line"
        >
          <ChartGalleryThemesMonochromeMonoLine :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Cyan & Orange Pulse"
          category="chart-gallery/themes/neon-glow"
          block="neon-line"
        >
          <ChartGalleryThemesNeonGlowNeonLine :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Triple Pastel Lines"
          category="chart-gallery/themes/pastel-dreams"
          block="pastel-line"
        >
          <ChartGalleryThemesPastelDreamsPastelLine :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Hot to Cold Transition"
          category="chart-gallery/themes/bold-contrast"
          block="bold-line"
        >
          <ChartGalleryThemesBoldContrastBoldLine :height="height" />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
