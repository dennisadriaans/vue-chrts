<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'chartthree']
})

interface MAUDataItem {
  'day': number
  'This period': number
  'Previous period': number
}

const categories: Record<string, BulletLegendItemInterface> = {
  'This period': { name: 'This period', color: '#7c6bed' },
  'Previous period': { name: 'Previous period', color: '#6b7280' }
}

const chartData: MAUDataItem[] = [
  { 'day': 1, 'This period': 3500, 'Previous period': 3200 },
  { 'day': 2, 'This period': 3300, 'Previous period': 3500 },
  { 'day': 3, 'This period': 3750, 'Previous period': 3100 },
  { 'day': 4, 'This period': 3950, 'Previous period': 3700 },
  { 'day': 5, 'This period': 3850, 'Previous period': 3400 },
  { 'day': 6, 'This period': 4050, 'Previous period': 3900 },
  { 'day': 7, 'This period': 4200, 'Previous period': 3750 },
  { 'day': 8, 'This period': 3950, 'Previous period': 4100 },
  { 'day': 9, 'This period': 4150, 'Previous period': 3850 },
  { 'day': 10, 'This period': 4550, 'Previous period': 4300 },
  { 'day': 11, 'This period': 4820, 'Previous period': 4150 },
  { 'day': 12, 'This period': 4700, 'Previous period': 4500 },
  { 'day': 13, 'This period': 4500, 'Previous period': 4200 },
  { 'day': 14, 'This period': 4620, 'Previous period': 4600 },
  { 'day': 15, 'This period': 4950, 'Previous period': 4350 },
  { 'day': 16, 'This period': 4600, 'Previous period': 4700 },
  { 'day': 17, 'This period': 4750, 'Previous period': 4450 },
  { 'day': 18, 'This period': 5050, 'Previous period': 4800 },
  { 'day': 19, 'This period': 5150, 'Previous period': 4550 },
  { 'day': 20, 'This period': 4950, 'Previous period': 4950 },
  { 'day': 21, 'This period': 5200, 'Previous period': 4650 },
  { 'day': 22, 'This period': 5400, 'Previous period': 5050 },
  { 'day': 23, 'This period': 5300, 'Previous period': 4750 },
  { 'day': 24, 'This period': 5500, 'Previous period': 5150 },
  { 'day': 25, 'This period': 5700, 'Previous period': 5250 },
  { 'day': 26, 'This period': 5620, 'Previous period': 5380 },
  { 'day': 27, 'This period': 5900, 'Previous period': 5600 },
  { 'day': 28, 'This period': 6100, 'Previous period': 5820 }
]

const xFormatter = (tick: number): string => {
  const item = chartData[tick]
  if (!item) return ''
  if ([0, 6, 13, 20, 27].includes(tick)) return `Jan ${item.day}`
  return ''
}

const yFormatter = (value: number): string => {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return String(value)
}

const lineDashArray: number[][] = [
  [0],
  [5]
]

const metric = '5.24k'
const metricChange = '+25%'

const { height } = useResponsiveHeight({
  default: 140,
  sm: 220
})
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <UCard class="relative overflow-hidden rounded-2xl bg-default/60!">
      <div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

      <div class="relative z-10 mb-8">
        <div class="flex items-end gap-3">
          <p class="text-default text-3xl font-bold tabular-nums tracking-tight">
            {{ metric }}
          </p>
          <div class="mb-1.5 flex items-center gap-1 text-sm font-semibold text-green-400">
            <UIcon
              name="i-lucide-triangle"
              class="size-3"
            />
            <span>{{ metricChange }}</span>
          </div>
        </div>
      </div>

      <div class="relative z-10">
        <LineChart
          class="dashed"
          :data="chartData"
          :height="height"
          :categories="categories"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :x-num-ticks="5"
          :y-num-ticks="4"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.BottomRight"
          :hide-legend="true"
          :line-dash-array="lineDashArray"
        />
      </div>
    </UCard>
  </div>
</template>

<style>
.dashed {
  --vis-axis-grid-line-dasharray: 5 5;
}
</style>
