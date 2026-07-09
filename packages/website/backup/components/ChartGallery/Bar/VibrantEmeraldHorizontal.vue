<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { dept: 'Engineering', value: 89 },
  { dept: 'Marketing', value: 72 },
  { dept: 'Sales', value: 95 },
  { dept: 'Support', value: 68 }
]
const categories = { value: { name: 'Performance', color: '#10b981' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['value']"
    :orientation="Orientation.Horizontal"
    :x-formatter="(i: number) => String(i)"
    :y-formatter="createXFormatter(data, 'dept')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="true"
    :radius="6"
    :bar-padding="0.35"
  />
</template>
