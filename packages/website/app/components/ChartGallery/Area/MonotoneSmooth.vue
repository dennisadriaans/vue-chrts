<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { x: 'W1', a: 30, b: 50 },
  { x: 'W2', a: 45, b: 60 },
  { x: 'W3', a: 55, b: 45 },
  { x: 'W4', a: 70, b: 80 }
]
const categories = {
  a: { name: 'Organic', color: '#64748b' },
  b: { name: 'Paid', color: '#94a3b8' }
}
</script>

<template>
  <AreaChart
    :data="data"
    :height="height"
    :categories="categories"
    :curve-type="CurveType.MonotoneX"
    :x-formatter="createXFormatter(data, 'x')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-num-ticks="5"
  />
</template>
