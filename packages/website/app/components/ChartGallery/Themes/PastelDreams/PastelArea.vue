<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const pastelAreaData = [
  { x: 'A', soft: 35, gentle: 50 },
  { x: 'B', soft: 55, gentle: 45 },
  { x: 'C', soft: 45, gentle: 65 },
  { x: 'D', soft: 70, gentle: 55 }
]
const pastelAreaCategories = {
  soft: { name: 'Soft', color: '#fda4af' },
  gentle: { name: 'Gentle', color: '#a5b4fc' }
}
</script>

<template>
  <div>
    <AreaChart
      :data="pastelAreaData"
      :height="height"
      :categories="pastelAreaCategories"
      :curve-type="CurveType.Basis"
      :x-formatter="createXFormatter(pastelAreaData, 'x')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="false"
      :y-num-ticks="4"
    />
  </div>
</template>
