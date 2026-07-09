<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 13. Spiky Analytics - High Frequency
const elegantLineData13 = [
  { sec: '1', requests: 120 },
  { sec: '2', requests: 340 },
  { sec: '3', requests: 180 },
  { sec: '4', requests: 420 },
  { sec: '5', requests: 280 },
  { sec: '6', requests: 520 },
  { sec: '7', requests: 380 },
  { sec: '8', requests: 290 }
]
const elegantLineCategories13 = { requests: { name: 'Requests/sec', color: '#a855f7' } }
</script>

<template>
  <LineChart
    :data="elegantLineData13"
    :height="height"
    :categories="elegantLineCategories13"
    :curve-type="CurveType.Linear"
    :x-formatter="createXFormatter(elegantLineData13, 'sec')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-domain-line="false"
    :y-num-ticks="5"
  />
</template>
