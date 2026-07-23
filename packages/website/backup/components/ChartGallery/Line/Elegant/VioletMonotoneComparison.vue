<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 5. Dual Monotone - Smooth Comparison
const elegantLineData5 = [
  { hour: '9AM', thisWeek: 120, lastWeek: 95 },
  { hour: '10AM', thisWeek: 180, lastWeek: 140 },
  { hour: '11AM', thisWeek: 220, lastWeek: 185 },
  { hour: '12PM', thisWeek: 280, lastWeek: 210 },
  { hour: '1PM', thisWeek: 250, lastWeek: 195 },
  { hour: '2PM', thisWeek: 310, lastWeek: 240 }
]
const elegantLineCategories5 = {
  thisWeek: { name: 'This Week', color: '#8b5cf6' },
  lastWeek: { name: 'Last Week', color: '#d4d4d8' }
}
</script>

<template>
  <LineChart
    :data="elegantLineData5"
    :height="height"
    :categories="elegantLineCategories5"
    :curve-type="CurveType.MonotoneX"
    :x-formatter="createXFormatter(elegantLineData5, 'hour')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :y-num-ticks="4"
  />
</template>
