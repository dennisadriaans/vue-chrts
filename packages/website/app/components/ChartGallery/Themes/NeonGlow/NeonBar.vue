<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const neonBarData = [
  { item: 'X', power: 85 },
  { item: 'Y', power: 65 },
  { item: 'Z', power: 95 }
]
const neonBarCategories = { power: { name: 'Power', color: '#ff00ff' } }
</script>

<template>
  <div>
    <BarChart
      :legend-position="LegendPosition.BottomCenter"
      :data="neonBarData"
      :height="height"
      :categories="neonBarCategories"
      :y-axis="['power']"
      :x-formatter="createXFormatter(neonBarData, 'item')"
      :hide-legend="false"
      :y-grid-line="false"
      :y-domain-line="false"
      :radius="12"
      :bar-padding="0.5"
    />
  </div>
</template>
