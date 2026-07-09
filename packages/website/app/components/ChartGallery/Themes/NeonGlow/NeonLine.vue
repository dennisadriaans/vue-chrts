<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const neonLineData = [
  { t: '0', a: 30, b: 50 },
  { t: '1', a: 55, b: 40 },
  { t: '2', a: 45, b: 70 },
  { t: '3', a: 75, b: 55 },
  { t: '4', a: 60, b: 85 }
]
const neonLineCategories = {
  a: { name: 'Pulse A', color: '#00ffff' },
  b: { name: 'Pulse B', color: '#ff6b35' }
}
</script>

<template>
  <div>
    <LineChart
      :data="neonLineData"
      :height="height"
      :categories="neonLineCategories"
      :curve-type="CurveType.Natural"
      :x-formatter="createXFormatter(neonLineData, 't')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="false"
      :x-grid-line="false"
    />
  </div>
</template>
