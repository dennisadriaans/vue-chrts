<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 8. Quad Series - Dense Data
const elegantLineData8 = [
  { x: 'A', s1: 20, s2: 35, s3: 28, s4: 42 },
  { x: 'B', s1: 35, s2: 28, s3: 45, s4: 32 },
  { x: 'C', s1: 28, s2: 42, s3: 38, s4: 55 },
  { x: 'D', s1: 45, s2: 55, s3: 32, s4: 48 },
  { x: 'E', s1: 52, s2: 38, s3: 58, s4: 42 }
]
const elegantLineCategories8 = {
  s1: { name: 'Series 1', color: '#06b6d4' },
  s2: { name: 'Series 2', color: '#8b5cf6' },
  s3: { name: 'Series 3', color: '#f97316' },
  s4: { name: 'Series 4', color: '#ec4899' }
}
</script>

<template>
  <LineChart
    :data="elegantLineData8"
    :height="height"
    :categories="elegantLineCategories8"
    :curve-type="CurveType.MonotoneX"
    :x-formatter="createXFormatter(elegantLineData8, 'x')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-num-ticks="4"
  />
</template>
