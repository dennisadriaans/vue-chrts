<script lang="ts" setup>
const colorMode = useColorMode()

interface WeeklyDataItem {
  week: string
  value: number
}

const chartData: WeeklyDataItem[] = [
  { week: 'W1', value: 8 },
  { week: 'W2', value: 11 },
  { week: 'W3', value: 11 },
  { week: 'W4', value: 15 },
  { week: 'W5', value: 13 },
  { week: 'W6', value: 18 },
  { week: 'W7', value: 22 },
  { week: 'W8', value: 20 }
]

const lineColor = '#a855f7'

const categories = {
  value: {
    name: 'Value',
    color: lineColor
  }
}

const markerConfig = computed(() => ({
  value: {
    type: 'circle' as const,
    size: 8,
    color: colorMode.value === 'dark' ? '#121212' : '#ffffff',
    strokeColor: lineColor,
    strokeWidth: 2
  }
}))

defineProps<{
  height?: number
}>()

const xFormatter = (tick: number) => chartData[tick]?.week ?? ''
const yFormatter = (value: number) => `${value}`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    v-bind="$attrs"
    :data="chartData"
    :height="height ?? 180"
    :categories="categories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.MonotoneX"
    :hide-legend="true"
    :x-grid-line="true"
    :y-grid-line="true"
    :x-domain-line="false"
    :y-domain-line="false"
    :x-tick-line="false"
    :y-tick-line="false"
    :x-num-ticks="8"
    :y-num-ticks="5"
    :y-domain="[0, 24]"
    :marker-config="markerConfig"
    :theme="{ grid: { dash: '5 5' } }"
  />
</template>
