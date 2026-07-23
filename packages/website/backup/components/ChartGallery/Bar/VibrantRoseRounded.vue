<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { category: 'React', count: 420 },
  { category: 'Vue', count: 380 },
  { category: 'Angular', count: 290 },
  { category: 'Svelte', count: 220 }
]

const categories = { count: { name: 'Downloads', color: '#f43f5e' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['count']"
    :x-formatter="createXFormatter(data, 'category')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :radius="16"
    :bar-padding="0.4"
    :y-num-ticks="4"
  />
</template>
