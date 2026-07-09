<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 10. Oscillation - Step After
const elegantLineData10 = [
  { time: 'T1', signal: 50 },
  { time: 'T2', signal: 75 },
  { time: 'T3', signal: 45 },
  { time: 'T4', signal: 80 },
  { time: 'T5', signal: 55 },
  { time: 'T6', signal: 70 }
]
const elegantLineCategories10 = { signal: { name: 'Signal', color: '#f59e0b' } }
</script>

<template>
  <LineChart
    :data="elegantLineData10"
    :height="height"
    :categories="elegantLineCategories10"
    :curve-type="CurveType.StepAfter"
    :x-formatter="createXFormatter(elegantLineData10, 'time')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="4"
  />
</template>
