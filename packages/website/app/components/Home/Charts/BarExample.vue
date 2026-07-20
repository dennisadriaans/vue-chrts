<script lang="ts" setup>
interface MonthlyDataItem {
  month: string
  revenue: number
  expenses: number
}

const MonthlyData: MonthlyDataItem[] = [
  // { month: 'Jan', revenue: 42000, expenses: 25000 },
  // { month: 'Feb', revenue: 46000, expenses: 27000 },
  // { month: 'Mar', revenue: 49000, expenses: 26000 },
  // { month: 'Apr', revenue: 48000, expenses: 29000 },
  // { month: 'May', revenue: 53000, expenses: 31000 },
  // { month: 'Jun', revenue: 57000, expenses: 32000 },
  { month: 'Jul', revenue: 55000, expenses: 34000 },
  { month: 'Aug', revenue: 61000, expenses: 36000 },
  { month: 'Sep', revenue: 65000, expenses: 33000 },
  { month: 'Oct', revenue: 63000, expenses: 37000 },
  { month: 'Nov', revenue: 68000, expenses: 39000 },
  { month: 'Dec', revenue: 73000, expenses: 41000 }
]

const MonthlyCategories = {
  revenue: {
    name: 'Revenue',
    color: 'var(--color-blue-500)'
  },
  expenses: {
    name: 'Expenses',
    color: 'var(--color-orange-500)'
  }
}

defineProps<{
  height?: number
}>()

const xFormatter = (value: number) => MonthlyData[value]?.month ?? ''
const yFormatter = (value: number) => `${Math.round(value / 1000)}k`
</script>

<template>
  <BarChart
    v-bind="$attrs"
    :data="MonthlyData"
    :height="height ?? 180"
    :categories="MonthlyCategories"
    :y-axis="['revenue', 'expenses']"
    x-axis="month"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :hide-legend="true"
    :x-grid-line="false"
    :y-grid-line="true"
    :x-domain-line="false"
    :y-domain-line="false"
    :radius="4"
    :x-num-ticks="12"
    :y-num-ticks="5"
  />
</template>
