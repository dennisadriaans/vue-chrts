<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { region: 'NA', q1: 450, q2: 520, q3: 480 },
  { region: 'EU', q1: 380, q2: 420, q3: 510 },
  { region: 'APAC', q1: 520, q2: 480, q3: 590 }
]
const categories = {
  q1: { name: 'Q1', color: '#f97316' },
  q2: { name: 'Q2', color: '#eab308' },
  q3: { name: 'Q3', color: '#84cc16' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['q1', 'q2', 'q3']"
    :stacked="true"
    :x-formatter="createXFormatter(data, 'region')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :radius="8"
    :bar-padding="0.25"
  />
</template>
