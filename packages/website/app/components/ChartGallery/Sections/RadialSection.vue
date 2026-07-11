<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const { paletteOptions, generateShades } = useChartPalette()
const selectedPalette = ref(paletteOptions[0]!.value)
const shades = computed(() => generateShades(selectedPalette.value, 5))

const getSnippet = () => `
<RadialBarChart
  :data="data"
  :categories="categories"
  :height="height"
  :corner-radius="4"
  :legend-position="LegendPosition.BottomCenter"
/>`.trim()

const browserData = [275, 200, 187, 173, 90]
const browserCategories = computed(() => ({
  a: { name: 'Chrome', color: shades.value[0] },
  b: { name: 'Safari', color: shades.value[1] },
  c: { name: 'Firefox', color: shades.value[2] },
  d: { name: 'Edge', color: shades.value[3] },
  e: { name: 'Other', color: shades.value[4] }
}))

const trafficData = [92, 68, 45]
const trafficCategories = computed(() => ({
  a: { name: 'Organic', color: shades.value[0] },
  b: { name: 'Direct', color: shades.value[2] },
  c: { name: 'Referral', color: shades.value[3] }
}))

const goalData = [78]
const goalCategories = computed(() => ({
  a: { name: 'Progress', color: shades.value[1] }
}))
</script>

<template>
  <div
    id="radial"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold">
          Radial Charts
        </h3>
        <p class="text-dimmed mt-1 text-sm">
          Concentric bars for rankings, progress and part-to-whole
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
        title="Browser Usage"
        :code="getSnippet()"
      >
        <RadialBarChart
          :data="browserData"
          :categories="browserCategories"
          :height="height + 40"
          :corner-radius="4"
          :legend-position="LegendPosition.BottomCenter"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Traffic Sources"
        :code="getSnippet()"
      >
        <RadialBarChart
          :data="trafficData"
          :categories="trafficCategories"
          :height="height + 40"
          :corner-radius="8"
          :legend-position="LegendPosition.BottomCenter"
        />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Goal Progress"
        :code="getSnippet()"
      >
        <div class="relative flex items-center justify-center">
          <RadialBarChart
            :data="goalData"
            :categories="goalCategories"
            :height="height + 40"
            :corner-radius="8"
            :inner-radius="'60%'"
            :outer-radius="'90%'"
            :end-angle="-270"
            :hide-legend="true"
          />
          <div class="pointer-events-none absolute text-center">
            <div class="text-3xl font-bold">
              78%
            </div>
            <div class="text-dimmed text-xs">
              Complete
            </div>
          </div>
        </div>
      </ChartGalleryCard>
    </div>
  </div>
</template>
