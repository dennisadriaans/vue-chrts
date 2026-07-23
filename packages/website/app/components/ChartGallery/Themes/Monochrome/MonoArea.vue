<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const monoAreaData = [
  { x: '1', v: 30 },
  { x: '2', v: 50 },
  { x: '3', v: 45 },
  { x: '4', v: 70 },
  { x: '5', v: 62 },
  { x: '6', v: 85 }
]
const monoAreaCategories = { v: { name: 'Value', color: '#374151' } }
</script>

<template>
  <div>
    <AreaChart
      :legend-position="LegendPosition.BottomCenter"
      :data="monoAreaData"
      :height="height"
      :categories="monoAreaCategories"
      :curve-type="CurveType.MonotoneX"
      :x-formatter="createXFormatter(monoAreaData, 'x')"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="false"
      :y-domain-line="false"
      :y-num-ticks="4"
    />
  </div>
</template>
