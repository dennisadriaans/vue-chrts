<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { period: 'Q1', revenue: 120, costs: -45 },
  { period: 'Q2', revenue: 180, costs: -62 },
  { period: 'Q3', revenue: 150, costs: -38 },
  { period: 'Q4', revenue: 220, costs: -75 }
]
const categories = {
  revenue: { name: 'Revenue', color: '#10b981' },
  costs: { name: 'Costs', color: '#ef4444' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['revenue', 'costs']"
    :x-formatter="createXFormatter(data, 'period')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :radius="6"
    :group-padding="0.2"
    :bar-padding="0.1"
  />
</template>
