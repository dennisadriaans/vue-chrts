<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const boldBarData = [
  { cat: 'Alpha', black: 90, white: 60 },
  { cat: 'Beta', black: 75, white: 85 },
  { cat: 'Gamma', black: 95, white: 70 }
]
const boldBarCategories = {
  black: { name: 'Dark', color: '#0f172a' },
  white: { name: 'Light', color: '#f1f5f9' }
}
</script>

<template>
  <div>
    <BarChart
      :data="boldBarData"
      :height="height"
      :categories="boldBarCategories"
      :y-axis="['black', 'white']"
      :x-formatter="createXFormatter(boldBarData, 'cat')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="false"
      :y-domain-line="true"
      :x-domain-line="true"
      :radius="6"
      :group-padding="0.25"
      :bar-padding="0.1"
    />
  </div>
</template>
