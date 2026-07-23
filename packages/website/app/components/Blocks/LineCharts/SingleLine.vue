<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'singleline']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 260 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 250 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#22c55e' }
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
      x-label="Time"
      y-label="Temperature"
      :categories="categories"
      :y-num-ticks="4"
      :x-num-ticks="7"
      :x-formatter="xFormatter"
      :curve-type="CurveType.Basis"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
    />
  </div>
</template>
