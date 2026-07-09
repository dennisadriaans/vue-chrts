<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { metric: 'Speed', score: 92 },
  { metric: 'Quality', score: 87 },
  { metric: 'Efficiency', score: 95 },
  { metric: 'Innovation', score: 78 }
]
const categories = { score: { name: 'Score', color: '#3b82f6' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['score']"
    :x-formatter="createXFormatter(data, 'metric')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="true"
    :radius="50"
    :bar-padding="0.5"
    :y-num-ticks="4"
  />
</template>
