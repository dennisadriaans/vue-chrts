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

const getSnippet = (layout: string, extra = '') => `
<BarChart
  :data="data"
  :height="height"
  :categories="categories"
  :y-axis="['a']"
  layout="${layout}"
  :x-formatter="createXFormatter(data, 'x')"
  :legend-position="LegendPosition.BottomCenter"
  :hide-legend="false"
  :y-grid-line="true"
  :y-num-ticks="4"${extra}
/>`.trim()

const singleData = [
  { x: 'React', a: 420 },
  { x: 'Vue', a: 380 },
  { x: 'Angular', a: 290 },
  { x: 'Svelte', a: 220 }
]
const singleCategories = computed(() => ({
  a: { name: 'Downloads', color: shades.value[2] }
}))

const groupedData = [
  { x: 'Q1', a: 4200, b: 3100 },
  { x: 'Q2', a: 5800, b: 4200 },
  { x: 'Q3', a: 7200, b: 5500 },
  { x: 'Q4', a: 8100, b: 6200 }
]
const groupedCategories = computed(() => ({
  a: { name: 'This Year', color: shades.value[1] },
  b: { name: 'Last Year', color: shades.value[3] }
}))

const stackedData = [
  { x: 'Jan', a: 3200, b: 2400, c: 1800 },
  { x: 'Feb', a: 3800, b: 2800, c: 2100 },
  { x: 'Mar', a: 4200, b: 3100, c: 2400 },
  { x: 'Apr', a: 4800, b: 3600, c: 2800 }
]
const stackedCategories = computed(() => ({
  a: { name: 'Product A', color: shades.value[0] },
  b: { name: 'Product B', color: shades.value[2] },
  c: { name: 'Product C', color: shades.value[4] }
}))

const horizontalData = [
  { x: 'Engineering', a: 89 },
  { x: 'Marketing', a: 72 },
  { x: 'Sales', a: 95 },
  { x: 'Support', a: 68 }
]
const horizontalCategories = computed(() => ({
  a: { name: 'Performance', color: shades.value[3] }
}))

const tripleGroupData = [
  { x: 'Jan', a: 65, b: 48, c: 82 },
  { x: 'Feb', a: 72, b: 55, c: 78 },
  { x: 'Mar', a: 80, b: 62, c: 90 },
  { x: 'Apr', a: 75, b: 58, c: 85 }
]
const tripleGroupCategories = computed(() => ({
  a: { name: 'Alpha', color: shades.value[0] },
  b: { name: 'Beta', color: shades.value[2] },
  c: { name: 'Gamma', color: shades.value[4] }
}))

const comparisonData = [
  { x: 'Mon', a: 45, b: 62 },
  { x: 'Tue', a: 52, b: 71 },
  { x: 'Wed', a: 48, b: 68 },
  { x: 'Thu', a: 61, b: 75 },
  { x: 'Fri', a: 55, b: 80 }
]
const comparisonCategories = computed(() => ({
  a: { name: 'Before', color: shades.value[1] },
  b: { name: 'After', color: shades.value[4] }
}))
</script>

<template>
  <div
    id="bar"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold">
          Bar Charts
        </h3>
        <p class="text-dimmed mt-1 text-sm">
          Grouped, stacked, and horizontal bar comparisons
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
        title="Framework Downloads"
        :code="getSnippet('vertical')"
      >
        <BarChart
          :data="singleData"
          :height="height"
          :categories="singleCategories"
          :y-axis="['a']"
          :x-formatter="createXFormatter(singleData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :radius="12"
          :bar-padding="0.4"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Year over Year"
        :code="getSnippet('vertical')"
      >
        <BarChart
          :data="groupedData"
          :height="height"
          :categories="groupedCategories"
          :y-axis="['a', 'b']"
          :x-formatter="createXFormatter(groupedData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :radius="4"
          :bar-padding="0.3"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Product Revenue"
        :code="getSnippet('vertical', '\n  stacked')"
      >
        <BarChart
          :data="stackedData"
          :height="height"
          :categories="stackedCategories"
          :y-axis="['a', 'b', 'c']"
          :x-formatter="createXFormatter(stackedData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :radius="4"
          :bar-padding="0.35"
          :y-num-ticks="4"
          stacked
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Team Performance"
        :code="getSnippet('horizontal')"
      >
        <BarChart
          :data="horizontalData"
          :height="height"
          :categories="horizontalCategories"
          :y-axis="['a']"
          :orientation="Orientation.Horizontal"
          :x-formatter="(i: number) => String(i)"
          :y-formatter="createXFormatter(horizontalData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="false"
          :x-grid-line="true"
          :radius="6"
          :bar-padding="0.35"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Quarterly Releases"
        :code="getSnippet('vertical')"
      >
        <BarChart
          :data="tripleGroupData"
          :height="height"
          :categories="tripleGroupCategories"
          :y-axis="['a', 'b', 'c']"
          :x-formatter="createXFormatter(tripleGroupData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :radius="2"
          :bar-padding="0.25"
          :y-num-ticks="4"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Before &amp; After"
        :code="getSnippet('vertical')"
      >
        <BarChart
          :data="comparisonData"
          :height="height"
          :categories="comparisonCategories"
          :y-axis="['a', 'b']"
          :x-formatter="createXFormatter(comparisonData, 'x')"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="false"
          :y-grid-line="true"
          :radius="8"
          :bar-padding="0.3"
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
          title="Purple-Cyan Grouped"
          category="chart-gallery/bar"
          block="vibrant-purple-cyan-grouped"
        >
          <ChartGalleryBarVibrantPurpleCyanGrouped :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Dual Tone Comparison"
          category="chart-gallery/bar"
          block="vibrant-dual-tone-comparison"
        >
          <ChartGalleryBarVibrantDualToneComparison :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Emerald Horizontal"
          category="chart-gallery/bar"
          block="vibrant-emerald-horizontal"
        >
          <ChartGalleryBarVibrantEmeraldHorizontal :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Rose Rounded"
          category="chart-gallery/bar"
          block="vibrant-rose-rounded"
        >
          <ChartGalleryBarVibrantRoseRounded :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Sunset Stacked"
          category="chart-gallery/bar"
          block="vibrant-sunset-stacked"
        >
          <ChartGalleryBarVibrantSunsetStacked :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Tangerine Wide Padding"
          category="chart-gallery/bar"
          block="vibrant-tangerine-wide-padding"
        >
          <ChartGalleryBarVibrantTangerineWidePadding :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Hot Pink Sharp"
          category="chart-gallery/bar"
          block="vibrant-hot-pink-sharp"
        >
          <ChartGalleryBarVibrantHotPinkSharp :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Rainbow Stacked"
          category="chart-gallery/bar"
          block="vibrant-rainbow-stacked"
        >
          <ChartGalleryBarVibrantRainbowStacked :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Electric Blue Pill"
          category="chart-gallery/bar"
          block="vibrant-electric-blue-pill"
        >
          <ChartGalleryBarVibrantElectricBluePill :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Coral Contrast Grouped"
          category="chart-gallery/bar"
          block="vibrant-coral-contrast-grouped"
        >
          <ChartGalleryBarVibrantCoralContrastGrouped :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Violet Minimal"
          category="chart-gallery/bar"
          block="vibrant-violet-minimal"
        >
          <ChartGalleryBarVibrantVioletMinimal :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Rose Tasks Tight"
          category="chart-gallery/bar"
          block="vibrant-rose-tasks-tight"
        >
          <ChartGalleryBarVibrantRoseTasksTight :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Ocean Depths Horizontal"
          category="chart-gallery/bar"
          block="vibrant-ocean-depths-horizontal-stacked"
        >
          <ChartGalleryBarVibrantOceanDepthsHorizontalStacked :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Emerald Triple Stacked"
          category="chart-gallery/bar"
          block="vibrant-emerald-triple-stacked"
        >
          <ChartGalleryBarVibrantEmeraldTripleStacked :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Grouped Financials"
          category="chart-gallery/bar"
          block="grouped-financials"
        >
          <ChartGalleryBarGroupedFinancials :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Stacked Team Hours"
          category="chart-gallery/bar"
          block="stacked-team-hours"
        >
          <ChartGalleryBarStackedTeamHours :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Grid Detailed Comparison"
          category="chart-gallery/bar"
          block="grid-detailed-comparison"
        >
          <ChartGalleryBarGridDetailedComparison :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Minimal Ratings"
          category="chart-gallery/bar"
          block="minimal-ratings"
        >
          <ChartGalleryBarMinimalRatings :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Charcoal Bars - Sharp"
          category="chart-gallery/themes/monochrome"
          block="mono-bar"
        >
          <ChartGalleryThemesMonochromeMonoBar :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Magenta Power"
          category="chart-gallery/themes/neon-glow"
          block="neon-bar"
        >
          <ChartGalleryThemesNeonGlowNeonBar :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Violet Bars"
          category="chart-gallery/themes/pastel-dreams"
          block="pastel-bar"
        >
          <ChartGalleryThemesPastelDreamsPastelBar :height="height" />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Dark & Light Bars"
          category="chart-gallery/themes/bold-contrast"
          block="bold-bar"
        >
          <ChartGalleryThemesBoldContrastBoldBar :height="height" />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
