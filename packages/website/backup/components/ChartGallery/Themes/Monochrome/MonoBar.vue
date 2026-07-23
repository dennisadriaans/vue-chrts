<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const monoBarData = [
  { label: 'A', val: 65 },
  { label: 'B', val: 82 },
  { label: 'C', val: 48 },
  { label: 'D', val: 95 }
]
const monoBarCategories = { val: { name: 'Score', color: '#1f2937' } }
</script>

<template>
  <div>
    <BarChart
      :legend-position="LegendPosition.BottomCenter"
      :data="monoBarData"
      :height="height"
      :categories="monoBarCategories"
      :y-axis="['val']"
      :x-formatter="createXFormatter(monoBarData, 'label')"
      :hide-legend="false"
      :y-grid-line="false"
      :y-domain-line="true"
      :x-domain-line="true"
      :radius="2"
      :bar-padding="0.35"
    />
  </div>
</template>
