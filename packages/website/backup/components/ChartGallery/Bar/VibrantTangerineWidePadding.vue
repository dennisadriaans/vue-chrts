<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { city: 'NYC', temp: 28 },
  { city: 'LA', temp: 35 },
  { city: 'CHI', temp: 22 },
  { city: 'MIA', temp: 31 }
]
const categories = { temp: { name: 'Temperature', color: '#fb923c' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['temp']"
    :x-formatter="createXFormatter(data, 'city')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="true"
    :radius="10"
    :bar-padding="0.6"
    :y-num-ticks="4"
  />
</template>
