<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

// 9. Minimalist Single - Clean Aesthetic
const elegantLineData9 = [
  { point: '1', value: 30 },
  { point: '2', value: 45 },
  { point: '3', value: 38 },
  { point: '4', value: 52 },
  { point: '5', value: 48 },
  { point: '6', value: 65 },
  { point: '7', value: 58 },
  { point: '8', value: 72 }
]
const elegantLineCategories9 = { value: { name: 'Value', color: '#3b82f6' } }
</script>

<template>
  <LineChart
    :data="elegantLineData9"
    :height="height"
    :categories="elegantLineCategories9"
    :curve-type="CurveType.MonotoneX"
    :x-formatter="createXFormatter(elegantLineData9, 'point')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
    :y-num-ticks="3"
  />
</template>
