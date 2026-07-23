<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'basiscurve']
})

const colorMode = useColorMode()

interface PerformanceDataItem {
  week: string
  response_time: number
  throughput: number
  error_rate: number
}

const PerformanceData: PerformanceDataItem[] = [
  { week: 'Week 1', response_time: 245, throughput: 1200, error_rate: 2.1 },
  { week: 'Week 2', response_time: 220, throughput: 1350, error_rate: 1.8 },
  { week: 'Week 3', response_time: 280, throughput: 1100, error_rate: 3.2 },
  { week: 'Week 4', response_time: 195, throughput: 1450, error_rate: 1.5 },
  { week: 'Week 5', response_time: 210, throughput: 1380, error_rate: 1.9 },
  { week: 'Week 6', response_time: 175, throughput: 1520, error_rate: 1.2 }
]

const PerformanceCategories = computed(() => ({
  response_time: {
    name: 'Response Time (ms)',
    color: '#ef4444' // red-500
  },
  throughput: {
    name: 'Throughput (req/s)',
    color: '#22c55e' // green-500
  },
  error_rate: {
    name: 'Error Rate (%)',
    color: '#f59e0b' // amber-500
  }
}))

const xFormatter = (i: number): string => `${PerformanceData[i]?.week}`
const yFormatter = (value: number): string => `${value}`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="PerformanceData"
    :height="300"
    :categories="PerformanceCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Basis"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="true"
    :y-grid-line="true"
    :x-domain-line="false"
    :y-domain-line="true"
    :x-tick-line="true"
    :y-tick-line="false"
    :x-num-ticks="6"
    :y-num-ticks="5"
    :hide-tooltip="false"
    x-label="Time Period"
    y-label="Metrics"
  />
</template>
