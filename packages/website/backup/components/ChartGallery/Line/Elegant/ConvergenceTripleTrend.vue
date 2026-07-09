<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 14. Convergence - Triple Meeting
const elegantLineData14 = [
  { phase: 'P1', a: 80, b: 20, c: 50 },
  { phase: 'P2', a: 65, b: 35, c: 50 },
  { phase: 'P3', a: 55, b: 45, c: 50 },
  { phase: 'P4', a: 50, b: 50, c: 50 },
  { phase: 'P5', a: 45, b: 55, c: 50 },
  { phase: 'P6', a: 35, b: 65, c: 50 }
]
const elegantLineCategories14 = {
  a: { name: 'Declining', color: '#ef4444' },
  b: { name: 'Rising', color: '#22c55e' },
  c: { name: 'Baseline', color: '#94a3b8' }
}
</script>

<template>
  <LineChart
    :data="elegantLineData14"
    :height="height"
    :categories="elegantLineCategories14"
    :curve-type="CurveType.Basis"
    :x-formatter="createXFormatter(elegantLineData14, 'phase')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :y-num-ticks="4"
  />
</template>
