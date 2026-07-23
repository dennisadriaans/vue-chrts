<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const boldLineData = [
  { pt: '1', hot: 20, cold: 80 },
  { pt: '2', hot: 45, cold: 55 },
  { pt: '3', hot: 70, cold: 30 },
  { pt: '4', hot: 85, cold: 15 }
]
const boldLineCategories = {
  hot: { name: 'Hot', color: '#ea580c' },
  cold: { name: 'Cold', color: '#0284c7' }
}
</script>

<template>
  <div>
    <LineChart
      :data="boldLineData"
      :height="height"
      :categories="boldLineCategories"
      :curve-type="CurveType.Cardinal"
      :x-formatter="createXFormatter(boldLineData, 'pt')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="false"
      :y-num-ticks="5"
    />
  </div>
</template>
