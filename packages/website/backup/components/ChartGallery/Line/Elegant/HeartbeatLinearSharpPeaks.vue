<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 6. Heartbeat Linear - Sharp Peaks
const elegantLineData6 = [
  { t: '1', pulse: 72 },
  { t: '2', pulse: 85 },
  { t: '3', pulse: 68 },
  { t: '4', pulse: 92 },
  { t: '5', pulse: 75 },
  { t: '6', pulse: 88 },
  { t: '7', pulse: 70 }
]
const elegantLineCategories6 = { pulse: { name: 'Pulse', color: '#ef4444' } }
</script>

<template>
  <LineChart
    :data="elegantLineData6"
    :height="height"
    :categories="elegantLineCategories6"
    :curve-type="CurveType.Linear"
    :x-formatter="createXFormatter(elegantLineData6, 't')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="3"
  />
</template>
