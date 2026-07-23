<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 12. Flat Baseline - Subtle Variations
const elegantLineData12 = [
  { m: 'Q1', rate: 2.1 },
  { m: 'Q2', rate: 2.4 },
  { m: 'Q3', rate: 2.2 },
  { m: 'Q4', rate: 2.6 },
  { m: 'Q5', rate: 2.3 },
  { m: 'Q6', rate: 2.8 }
]
const elegantLineCategories12 = { rate: { name: 'Interest Rate', color: '#64748b' } }
</script>

<template>
  <LineChart
    :data="elegantLineData12"
    :height="height"
    :categories="elegantLineCategories12"
    :curve-type="CurveType.MonotoneX"
    :x-formatter="createXFormatter(elegantLineData12, 'm')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="4"
  />
</template>
