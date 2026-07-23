<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { x: 'Q1', primary: 120, secondary: 80 },
  { x: 'Q2', primary: 180, secondary: 120 },
  { x: 'Q3', primary: 150, secondary: 100 },
  { x: 'Q4', primary: 220, secondary: 160 }
]
const categories = {
  primary: { name: 'Sales', color: '#1e293b' },
  secondary: { name: 'Returns', color: '#cbd5e1' }
}
</script>

<template>
  <AreaChart
    :data="data"
    :height="height"
    :categories="categories"
    :curve-type="CurveType.Linear"
    :x-formatter="createXFormatter(data, 'x')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="5"
    :min-max-ticks-only="true"
  />
</template>
