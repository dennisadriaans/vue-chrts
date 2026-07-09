<script lang="ts" setup>
interface DailyData {
  day: string
  Income: number
  Expense: number
}

// Data adjusted to be linear (constant increments)
const chartData = ref<DailyData[]>([
  { day: 'Jan', Income: 5000, Expense: 3000 },
  { day: 'Feb', Income: 6000, Expense: 3500 },
  { day: 'Mar', Income: 7000, Expense: 4000 },
  { day: 'Apr', Income: 8000, Expense: 4500 },
  { day: 'May', Income: 9000, Expense: 5000 },
  { day: 'Jun', Income: 10000, Expense: 5500 },
  { day: 'Jul', Income: 11000, Expense: 6000 }
])

const chartCategories: Record<string, BulletLegendItemInterface> = {
  Income: {
    name: 'Income',
    color: '#10b981'
  },
  Expense: {
    name: 'Expense',
    color: '#f59e0b'
  }
}

const xAxisFormatter = (tick: number): string => {
  const months = chartData.value.map(item => item.day)
  return months[tick] || ''
}

const { height } = useResponsiveHeight({
  default: 160,
  lg: 240
})
</script>

<template>
  <LineChart
    :data="chartData"
    :categories="chartCategories"
    :y-axis="['Income', 'Expense']"
    :x-formatter="xAxisFormatter"
    :height="height"
    :stacked="false"
    :radius="3"
    :group-padding="0.2"
    :bar-padding="0.2"
    :x-grid-line="true"
    :y-grid-line="false"
    :y-num-ticks="4"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="true"
    class="dashed"
  />
</template>
