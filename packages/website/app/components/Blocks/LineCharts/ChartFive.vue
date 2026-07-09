<script setup lang="ts">
defineOptions({
  tags: ['linecharts', 'chartfive']
})

const chartData = [
  { month: 'January', Boston: 30, NewYork: 32, WashingtonDC: 35 },
  { month: 'February', Boston: 33, NewYork: 35, WashingtonDC: 37 },
  { month: 'March', Boston: 40, NewYork: 42, WashingtonDC: 45 },
  { month: 'April', Boston: 50, NewYork: 53, WashingtonDC: 55 },
  { month: 'May', Boston: 60, NewYork: 65, WashingtonDC: 67 },
  { month: 'June', Boston: 70, NewYork: 75, WashingtonDC: 77 },
  { month: 'July', Boston: 75, NewYork: 80, WashingtonDC: 82 },
  { month: 'August', Boston: 73, NewYork: 78, WashingtonDC: 80 },
  { month: 'September', Boston: 68, NewYork: 72, WashingtonDC: 75 },
  { month: 'October', Boston: 58, NewYork: 62, WashingtonDC: 65 },
  { month: 'November', Boston: 48, NewYork: 52, WashingtonDC: 55 },
  { month: 'December', Boston: 35, NewYork: 38, WashingtonDC: 40 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  Boston: { name: 'Boston', color: '#3b82f6' },
  NewYork: { name: 'New York', color: '#f59e42' },
  WashingtonDC: { name: 'Washington DC', color: '#22c55e' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return String(chartData[tick]?.month ?? '')
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard>
    <h2 class="text-xl font-semibold tracking-tight">
      Temperature
    </h2>

    <UCard
      variant="subtle"
      class="mt-4"
    >
      <LineChart
        :data="chartData"
        :height="height"
        x-label="Time"
        y-label="Temperature"
        :categories="categories"
        :y-num-ticks="2"
        :x-num-ticks="6"
        :x-formatter="xFormatter"
        :curve-type="CurveType.Basis"
        :legend-position="LegendPosition.TopRight"
        :hide-legend="false"
        :y-grid-line="true"
      />
    </UCard>
  </UCard>
</template>
