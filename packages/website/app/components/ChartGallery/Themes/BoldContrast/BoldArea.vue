<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const boldAreaData = [
  { x: '1', fire: 50, ice: 80 },
  { x: '2', fire: 75, ice: 55 },
  { x: '3', fire: 90, ice: 45 },
  { x: '4', fire: 60, ice: 70 }
]
const boldAreaCategories = {
  fire: { name: 'Fire', color: '#dc2626' },
  ice: { name: 'Ice', color: '#0ea5e9' }
}
</script>

<template>
  <div>
    <AreaChart
      :data="boldAreaData"
      :height="height"
      :categories="boldAreaCategories"
      :curve-type="CurveType.Linear"
      :x-formatter="createXFormatter(boldAreaData, 'x')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="true"
      :y-num-ticks="4"
    />
  </div>
</template>
