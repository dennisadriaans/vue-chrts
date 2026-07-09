<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { item: 'Item 1', amount: 340 },
  { item: 'Item 2', amount: 480 },
  { item: 'Item 3', amount: 290 },
  { item: 'Item 4', amount: 520 },
  { item: 'Item 5', amount: 410 },
  { item: 'Item 6', amount: 380 }
]
const categories = { amount: { name: 'Amount', color: '#a855f7' } }
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['amount']"
    :x-formatter="createXFormatter(data, 'item')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
    :radius="2"
    :bar-padding="0.15"
    :y-num-ticks="3"
  />
</template>
