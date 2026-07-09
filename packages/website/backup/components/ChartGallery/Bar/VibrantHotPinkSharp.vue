<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { product: 'A', sales: 850 },
  { product: 'B', sales: 620 },
  { product: 'C', sales: 940 },
  { product: 'D', sales: 510 },
  { product: 'E', sales: 780 }
]
const categories = { sales: { name: 'Revenue', color: '#ec4899' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['sales']"
    :x-formatter="createXFormatter(data, 'product')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :radius="0"
    :bar-padding="0.2"
    :min-max-ticks-only="true"
  />
</template>
