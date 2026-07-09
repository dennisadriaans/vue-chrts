<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const monoLineData = [
  { x: 'W1', y1: 20, y2: 35 },
  { x: 'W2', y1: 35, y2: 45 },
  { x: 'W3', y1: 28, y2: 52 },
  { x: 'W4', y1: 45, y2: 60 }
]
const monoLineCategories = {
  y1: { name: 'Current', color: '#111827' },
  y2: { name: 'Previous', color: '#9ca3af' }
}
</script>

<template>
  <div>
    <LineChart
      :data="monoLineData"
      :height="height"
      :categories="monoLineCategories"
      :curve-type="CurveType.Linear"
      :x-formatter="createXFormatter(monoLineData, 'x')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="true"
      :y-num-ticks="4"
    />
  </div>
</template>
