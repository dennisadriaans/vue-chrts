<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 1. Teal Cardinal - Smooth Wave
const elegantLineData1 = [
  { x: '00:00', temp: 18 },
  { x: '06:00', temp: 16 },
  { x: '12:00', temp: 24 },
  { x: '18:00', temp: 22 },
  { x: '24:00', temp: 17 }
]
const elegantLineCategories1 = { temp: { name: 'Temperature', color: '#14b8a6' } }
</script>

<template>
  <LineChart
    :data="elegantLineData1"
    :height="height"
    :categories="elegantLineCategories1"
    :curve-type="CurveType.Cardinal"
    :x-formatter="createXFormatter(elegantLineData1, 'x')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="4"
  />
</template>
