<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { day: 'Mon', tasks: 12 },
  { day: 'Tue', tasks: 19 },
  { day: 'Wed', tasks: 8 },
  { day: 'Thu', tasks: 15 },
  { day: 'Fri', tasks: 22 }
]
const categories = { tasks: { name: 'Tasks', color: '#f43f5e' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['tasks']"
    :x-formatter="createXFormatter(data, 'day')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :radius="12"
    :bar-padding="0.08"
    :y-num-ticks="4"
  />
</template>
