<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { x: '1', y: 20 },
  { x: '2', y: 45 },
  { x: '3', y: 35 },
  { x: '4', y: 60 },
  { x: '5', y: 52 },
  { x: '6', y: 75 },
  { x: '7', y: 68 }
]
const categories = {
  y: {
    name: 'Signal',
    color: '#0ea5e9'
  }
}
</script>

<template>
  <AreaChart
    :data="data"
    :height="height"
    :categories="categories"
    :curve-type="CurveType.Step"
    :x-formatter="createXFormatter(data, 'x')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-domain-line="false"
    :x-domain-line="false"
    :x-num-ticks="7"
    :y-num-ticks="4"
  />
</template>
