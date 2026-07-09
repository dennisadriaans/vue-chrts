<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { project: 'Alpha', phase1: 30, phase2: 45, phase3: 25 },
  { project: 'Beta', phase1: 40, phase2: 35, phase3: 45 },
  { project: 'Gamma', phase1: 25, phase2: 55, phase3: 30 }
]
const categories = {
  phase1: { name: 'Phase 1', color: '#059669' },
  phase2: { name: 'Phase 2', color: '#34d399' },
  phase3: { name: 'Phase 3', color: '#a7f3d0' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['phase1', 'phase2', 'phase3']"
    :stacked="true"
    :x-formatter="createXFormatter(data, 'project')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :radius="6"
    :bar-padding="0.35"
    :y-num-ticks="5"
  />
</template>
