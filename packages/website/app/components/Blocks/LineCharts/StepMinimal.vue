<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'stepminimal']
})

const colorMode = useColorMode()

interface MetricDataItem {
  time: string
  cpu: number
}

const MetricData: MetricDataItem[] = [
  { time: '00:00', cpu: 45 },
  { time: '04:00', cpu: 52 },
  { time: '08:00', cpu: 78 },
  { time: '12:00', cpu: 65 },
  { time: '16:00', cpu: 82 },
  { time: '20:00', cpu: 58 },
  { time: '24:00', cpu: 41 }
]

const MetricCategories = computed(() => ({
  cpu: {
    name: 'CPU Usage',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  }
}))

const xFormatter = (i: number): string => `${MetricData[i]?.time}`
const yFormatter = (value: number): string => `${value}%`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="MetricData"
    :height="300"
    :categories="MetricCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Step"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="true"
    :y-grid-line="false"
    :x-domain-line="false"
    :y-domain-line="false"
    :y-num-ticks="4"
    :hide-tooltip="false"
    x-label="Time (24h)"
    y-label="Usage"
  />
</template>
