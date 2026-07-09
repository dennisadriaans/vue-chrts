<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const pastelLineData = [
  { day: '1', pink: 25, mint: 40, peach: 35 },
  { day: '2', pink: 40, mint: 55, peach: 30 },
  { day: '3', pink: 35, mint: 45, peach: 50 },
  { day: '4', pink: 55, mint: 60, peach: 45 }
]
const pastelLineCategories = {
  pink: { name: 'Pink', color: '#f9a8d4' },
  mint: { name: 'Mint', color: '#86efac' },
  peach: { name: 'Peach', color: '#fed7aa' }
}
</script>

<template>
  <div>
    <LineChart
      :data="pastelLineData"
      :height="height"
      :categories="pastelLineCategories"
      :curve-type="CurveType.MonotoneX"
      :x-formatter="createXFormatter(pastelLineData, 'day')"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :y-grid-line="false"
      :y-domain-line="true"
      :x-domain-line="true"
    />
  </div>
</template>
