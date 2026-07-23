<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 3. Red Blue - Step Monitor
const elegantLineData3 = [
  { week: '1', cpu: 45, memory: 62 },
  { week: '2', cpu: 55, memory: 58 },
  { week: '3', cpu: 68, memory: 72 },
  { week: '4', cpu: 52, memory: 65 },
  { week: '5', cpu: 78, memory: 82 },
  { week: '6', cpu: 62, memory: 70 }
]
const elegantLineCategories3 = {
  cpu: { name: 'CPU', color: '#ef4444' },
  memory: { name: 'Memory', color: '#3b82f6' }
}
</script>

<template>
  <LineChart
    :data="elegantLineData3"
    :height="height"
    :categories="elegantLineCategories3"
    :curve-type="CurveType.Step"
    :x-formatter="createXFormatter(elegantLineData3, 'week')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-num-ticks="5"
  />
</template>
