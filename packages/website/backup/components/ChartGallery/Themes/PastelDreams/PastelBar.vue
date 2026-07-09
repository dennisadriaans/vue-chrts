<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const pastelBarData = [
  { name: 'Rose', amount: 420 },
  { name: 'Lily', amount: 380 },
  { name: 'Tulip', amount: 310 },
  { name: 'Daisy', amount: 450 }
]
const pastelBarCategories = { amount: { name: 'Count', color: '#c4b5fd' } }
</script>

<template>
  <div>
    <BarChart
      :legend-position="LegendPosition.BottomCenter"
      :data="pastelBarData"
      :height="height"
      :categories="pastelBarCategories"
      :y-axis="['amount']"
      :x-formatter="createXFormatter(pastelBarData, 'name')"
      :hide-legend="false"
      :y-grid-line="true"
      :radius="10"
      :bar-padding="0.3"
    />
  </div>
</template>
