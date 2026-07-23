<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 11. Gradient Duo - Contrasting Curves
const elegantLineData11 = [
  { idx: 'Jan', revenue: 45, expenses: 32 },
  { idx: 'Feb', revenue: 52, expenses: 38 },
  { idx: 'Mar', revenue: 48, expenses: 42 },
  { idx: 'Apr', revenue: 61, expenses: 45 },
  { idx: 'May', revenue: 55, expenses: 48 },
  { idx: 'Jun', revenue: 68, expenses: 52 }
]
const elegantLineCategories11 = {
  revenue: { name: 'Revenue', color: '#22c55e' },
  expenses: { name: 'Expenses', color: '#f43f5e' }
}
</script>

<template>
  <LineChart
    :data="elegantLineData11"
    :height="height"
    :categories="elegantLineCategories11"
    :curve-type="CurveType.Cardinal"
    :x-formatter="createXFormatter(elegantLineData11, 'idx')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :y-num-ticks="4"
  />
</template>
