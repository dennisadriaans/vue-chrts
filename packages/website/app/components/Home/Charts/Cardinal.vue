<script lang="ts" setup>
interface TrafficDataItem {
  hour: string
  organic: number
  paid: number
  social: number
  direct: number
}

const TrafficData: TrafficDataItem[] = [
  { hour: '06:00', organic: 120, paid: 45, social: 30, direct: 85 },
  { hour: '09:00', organic: 280, paid: 90, social: 65, direct: 150 },
  { hour: '12:00', organic: 450, paid: 180, social: 120, direct: 220 },
  { hour: '15:00', organic: 380, paid: 165, social: 95, direct: 190 },
  { hour: '18:00', organic: 520, paid: 200, social: 140, direct: 260 },
  { hour: '21:00', organic: 320, paid: 130, social: 80, direct: 170 }
]

const TrafficCategories = computed(() => ({
  organic: {
    name: 'Organic',
    color: 'var(--color-green-500)'
  },
  paid: {
    name: 'Paid',
    color: 'var(--color-blue-500)'
  },
  social: {
    name: 'Social',
    color: 'var(--color-purple-500)'
  },
  direct: {
    name: 'Direct',
    color: 'var(--color-amber-500)'
  }
}))

defineProps<{
  height?: number
}>()

const xFormatter = (value: number) => TrafficData[value]?.hour ?? ''
const yFormatter = (value: number) => `${value}`
</script>

<template>
  <AreaChart
    v-bind="$attrs"
    :data="TrafficData"
    :height="180"
    :categories="TrafficCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Cardinal"
    :legend-position="LegendPosition.TopCenter "
    :hide-legend="false"
    :x-grid-line="false"
    :y-grid-line="true"
    :x-domain-line="false"
    :y-domain-line="false"
    stacked
    :x-num-ticks="6"
    x-label="Time of Day"
  />
</template>
