<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'gradientstep']
})

const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})
const colorMode = useColorMode()

interface AreaChartItem {
  quarter: string
  revenue: number
  expenses: number
}

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  revenue: {
    name: 'Revenue',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  expenses: {
    name: 'Expenses',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  }
}))

const AreaChartData: AreaChartItem[] = [
  { quarter: 'Q1 2024', revenue: 4200, expenses: 2800 },
  { quarter: 'Q2 2024', revenue: 5100, expenses: 3200 },
  { quarter: 'Q3 2024', revenue: 3900, expenses: 2900 },
  { quarter: 'Q4 2024', revenue: 6800, expenses: 4100 }
]

const xFormatter = (i: number): string => `${AreaChartData[i]?.quarter}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <AreaChart
      :key="colorMode.value"
      :data="AreaChartData"
      :height="height"
      :categories="categories"
      :curve-type="CurveType.Step"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="false"
      :x-num-ticks="4"
      :y-num-ticks="5"
      x-label="Quarter"
      y-label="Amount"
    />
  </div>
</template>
