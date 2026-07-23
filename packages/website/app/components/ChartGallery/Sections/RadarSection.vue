<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const { paletteOptions, generateShades } = useChartPalette()
const selectedPalette = ref(paletteOptions[0]!.value)
const shades = computed(() => generateShades(selectedPalette.value, 3))

const getSnippet = () => `
<RadarChart
  :data="data"
  :categories="categories"
  data-key="metric"
  :height="height"
  :legend-position="LegendPosition.BottomCenter"
/>`.trim()

// Two-series product comparison.
const productData = [
  { metric: 'Speed', productA: 120, productB: 90 },
  { metric: 'Reliability', productA: 98, productB: 130 },
  { metric: 'Comfort', productA: 86, productB: 130 },
  { metric: 'Safety', productA: 99, productB: 100 },
  { metric: 'Efficiency', productA: 85, productB: 90 },
  { metric: 'Price', productA: 65, productB: 85 }
]
const productCategories = computed(() => ({
  productA: { name: 'Product A', color: shades.value[0] },
  productB: { name: 'Product B', color: shades.value[2] }
}))

// Single-series skill profile.
const skillData = [
  { skill: 'Design', score: 90 },
  { skill: 'Code', score: 78 },
  { skill: 'Testing', score: 65 },
  { skill: 'DevOps', score: 82 },
  { skill: 'Docs', score: 55 }
]
const skillCategories = computed(() => ({
  score: { name: 'Team', color: shades.value[0] }
}))

// Three-region performance radar.
const regionData = [
  { area: 'Sales', north: 88, south: 72, east: 95 },
  { area: 'Support', north: 76, south: 90, east: 68 },
  { area: 'Growth', north: 92, south: 64, east: 80 },
  { area: 'Retention', north: 70, south: 85, east: 78 },
  { area: 'NPS', north: 84, south: 79, east: 88 }
]
const regionCategories = computed(() => ({
  north: { name: 'North', color: shades.value[0] },
  south: { name: 'South', color: shades.value[1] },
  east: { name: 'East', color: shades.value[2] }
}))
</script>

<template>
  <div
    id="radar"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold">
          Radar Charts
        </h3>
        <p class="text-dimmed mt-1 text-sm">
          Compare multiple variables across a shared set of axes
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

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartGalleryCard
        title="Product Comparison"
        :code="getSnippet()"
      >
        <RadarChart
          :data="productData"
          :categories="productCategories"
          data-key="metric"
          :height="height + 40"
          :legend-position="LegendPosition.BottomCenter"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Skill Profile"
        :code="getSnippet()"
      >
        <RadarChart
          :data="skillData"
          :categories="skillCategories"
          data-key="skill"
          :height="height + 40"
          :legend-position="LegendPosition.BottomCenter"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Regional Performance"
        :code="getSnippet()"
      >
        <RadarChart
          :data="regionData"
          :categories="regionCategories"
          data-key="area"
          :height="height + 40"
          :legend-position="LegendPosition.BottomCenter"
        />
      </ChartGalleryCard>
    </div>
  </div>
</template>
