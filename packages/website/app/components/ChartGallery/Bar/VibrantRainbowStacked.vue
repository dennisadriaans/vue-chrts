<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { week: 'W1', a: 120, b: 180, c: 90, d: 150 },
  { week: 'W2', a: 150, b: 140, c: 170, d: 110 },
  { week: 'W3', a: 100, b: 200, c: 130, d: 180 }
]
const categories = {
  a: { name: 'Stream A', color: '#ef4444' },
  b: { name: 'Stream B', color: '#f59e0b' },
  c: { name: 'Stream C', color: '#22c55e' },
  d: { name: 'Stream D', color: '#3b82f6' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['a', 'b', 'c', 'd']"
    :stacked="true"
    :x-formatter="createXFormatter(data, 'week')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :radius="4"
    :bar-padding="0.3"
  />
</template>
