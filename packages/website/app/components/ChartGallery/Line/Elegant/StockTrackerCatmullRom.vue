<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const elegantLineData7 = [
  { date: 'W1', price: 142 },
  { date: 'W2', price: 156 },
  { date: 'W3', price: 148 },
  { date: 'W4', price: 172 },
  { date: 'W5', price: 165 },
  { date: 'W6', price: 188 },
  { date: 'W7', price: 195 }
]
const elegantLineCategories7 = { price: { name: 'Stock Price', color: '#10b981' } }
</script>

<template>
  <LineChart
    :data="elegantLineData7"
    :height="height"
    :categories="elegantLineCategories7"
    :curve-type="CurveType.CatmullRom"
    :x-formatter="createXFormatter(elegantLineData7, 'date')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="true"
    :y-num-ticks="5"
  />
</template>
