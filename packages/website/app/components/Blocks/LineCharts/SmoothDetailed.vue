<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'smoothdetailed']
})

const colorMode = useColorMode()

interface FinanceDataItem {
  month: string
  revenue: number
  expenses: number
  profit: number
}

const FinanceData: FinanceDataItem[] = [
  { month: 'Jan', revenue: 12000, expenses: 8500, profit: 3500 },
  { month: 'Feb', revenue: 14500, expenses: 9200, profit: 5300 },
  { month: 'Mar', revenue: 11800, expenses: 8800, profit: 3000 },
  { month: 'Apr', revenue: 16200, expenses: 10500, profit: 5700 },
  { month: 'May', revenue: 18900, expenses: 11200, profit: 7700 },
  { month: 'Jun', revenue: 20100, expenses: 12000, profit: 8100 },
  { month: 'Jul', revenue: 22500, expenses: 13500, profit: 9000 },
  { month: 'Aug', revenue: 19800, expenses: 12800, profit: 7000 }
]

const FinanceCategories = computed(() => ({
  revenue: {
    name: 'Revenue',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  },
  expenses: {
    name: 'Expenses',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  },
  profit: {
    name: 'Profit',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  }
}))

const xFormatter = (i: number): string => `${FinanceData[i]?.month}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(0)}k`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="FinanceData"
    :height="300"
    :categories="FinanceCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.MonotoneX"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="true"
    :y-grid-line="true"
    :x-domain-line="true"
    :y-domain-line="true"
    :x-tick-line="true"
    :y-tick-line="true"
    :x-num-ticks="8"
    :y-num-ticks="6"
    x-label="Month"
    y-label="Amount"
  />
</template>
