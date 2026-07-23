<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'multilines']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

const chartData = [
  { month: 'January', desktop: 186, mobile: 186 },
  { month: 'February', desktop: 305, mobile: 305 },
  { month: 'March', desktop: 237, mobile: 237 },
  { month: 'April', desktop: 260, mobile: 209 },
  { month: 'May', desktop: 209, mobile: 209 },
  { month: 'June', desktop: 250, mobile: 214 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#3b82f6' },
  mobile: { name: 'Mobile', color: '#22c55e' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return chartData[tick]?.month ?? ''
}
</script>

<template>
  <div
    class="mx-auto max-w-3xl space-y-6 rounded-lg"
    :class="showTitle ? 'p-6' : ''"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Line Chart
      </h3>
      <NuxtLink to="/blocks/line-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <LineChart
      :data="chartData"
      :height="300"
      y-label="Number of visits"
      :x-num-ticks="2"
      :categories="categories"
      :x-formatter="xFormatter"
      :y-grid-line="true"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>
