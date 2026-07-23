<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const neonAreaData = [
  { x: '1', neon: 40 },
  { x: '2', neon: 75 },
  { x: '3', neon: 55 },
  { x: '4', neon: 90 },
  { x: '5', neon: 70 },
  { x: '6', neon: 100 }
]
const neonAreaCategories = { neon: { name: 'Activity', color: '#00ff88' } }
</script>

<template>
  <div>
    <AreaChart
      :legend-position="LegendPosition.BottomCenter"
      :data="neonAreaData"
      :height="height"
      :categories="neonAreaCategories"
      :curve-type="CurveType.Cardinal"
      :x-formatter="createXFormatter(neonAreaData, 'x')"
      :hide-legend="false"
      :y-grid-line="false"
      :x-grid-line="false"
      :y-domain-line="false"
      :x-domain-line="false"
    />
  </div>
</template>
