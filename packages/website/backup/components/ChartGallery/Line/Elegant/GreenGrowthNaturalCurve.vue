<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 4. Green Growth - Natural Curve
const elegantLineData4 = [
  { period: 'Jan', growth: 12 },
  { period: 'Feb', growth: 18 },
  { period: 'Mar', growth: 15 },
  { period: 'Apr', growth: 25 },
  { period: 'May', growth: 22 },
  { period: 'Jun', growth: 32 }
]
const elegantLineCategories4 = { growth: { name: 'Growth %', color: '#22c55e' } }
</script>

<template>
  <LineChart
    :data="elegantLineData4"
    :height="height"
    :categories="elegantLineCategories4"
    :curve-type="CurveType.Natural"
    :x-formatter="createXFormatter(elegantLineData4, 'period')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="4"
    :min-max-ticks-only="true"
  />
</template>
