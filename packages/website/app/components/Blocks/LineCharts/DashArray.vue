<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'dasharray']
})

const chartData = [
  { month: 'January', desktop: 120 },
  { month: 'February', desktop: 185 },
  { month: 'March', desktop: 160 },
  { month: 'April', desktop: 220 },
  { month: 'May', desktop: 195 },
  { month: 'June', desktop: 270 }
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
      :line-dash-array="[[5, 5]]"
      :x-formatter="xFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
      @click="(e, data) => console.log('Chart clicked', data)"
    >
      <template #tooltip="{ values }">
        <div>Custom tooltip: {{ values }}</div>
      </template>
    </LineChart>
  </div>
</template>
