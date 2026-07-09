<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { category: 'Alpha', current: 78, target: 90 },
  { category: 'Beta', current: 85, target: 82 },
  { category: 'Gamma', current: 62, target: 75 },
  { category: 'Delta', current: 91, target: 88 }
]
const categories = {
  current: { name: 'Current', color: '#f97316' },
  target: { name: 'Target', color: '#64748b' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['current', 'target']"
    :x-formatter="createXFormatter(data, 'category')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :radius="3"
    :group-padding="0.25"
    :bar-padding="0.15"
    :y-num-ticks="5"
  />
</template>
