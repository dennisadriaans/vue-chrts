<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'step']
})

const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})
interface AreaChartItem {
  month: string
  desktop: number
}

const AreaChartData: AreaChartItem[] = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 }
]
const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#3b82f6' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  const month = AreaChartData[tick]?.month
  return month ? String(month) : ''
}
</script>

<template>
  <div
    class="mx-auto max-w-3xl space-y-6 rounded-lg"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Area Chart
      </h3>
      <NuxtLink to="/blocks/area-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <AreaChart
      :data="AreaChartData"
      :height="height"
      x-label="Month"
      y-label="Score"
      :categories="categories"
      :y-num-ticks="4"
      :x-num-ticks="7"
      :y-grid-line="true"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :x-formatter="xFormatter"
      :curve-type="CurveType.Step"
    />
  </div>
</template>
