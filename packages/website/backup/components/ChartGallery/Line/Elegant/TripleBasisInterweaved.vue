<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 2. Triple Basis - Interweaved
const elegantLineData2 = [
  { day: 'Mon', series1: 45, series2: 30, series3: 55 },
  { day: 'Tue', series1: 52, series2: 48, series3: 42 },
  { day: 'Wed', series1: 38, series2: 55, series3: 60 },
  { day: 'Thu', series1: 65, series2: 42, series3: 48 },
  { day: 'Fri', series1: 58, series2: 62, series3: 52 }
]
const elegantLineCategories2 = {
  series1: { name: 'Alpha', color: '#7c3aed' },
  series2: { name: 'Beta', color: '#2dd4bf' },
  series3: { name: 'Gamma', color: '#fb923c' }
}
</script>

<template>
  <LineChart
    :data="elegantLineData2"
    :height="height"
    :categories="elegantLineCategories2"
    :curve-type="CurveType.Basis"
    :x-formatter="createXFormatter(elegantLineData2, 'day')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
  />
</template>
