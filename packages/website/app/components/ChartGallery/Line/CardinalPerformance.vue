<script lang="ts" setup>
interface Props {
  height: number
}

const { height } = defineProps<Props>()

const colorMode = useColorMode()

interface PerformanceDataItem {
  week: string
  latency: number
  throughput: number
  errors: number
}

const PerformanceData: PerformanceDataItem[] = [
  { week: 'W1', latency: 120, throughput: 850, errors: 12 },
  { week: 'W2', latency: 98, throughput: 920, errors: 8 },
  { week: 'W3', latency: 115, throughput: 880, errors: 15 },
  { week: 'W4', latency: 88, throughput: 980, errors: 5 },
  { week: 'W5', latency: 92, throughput: 1020, errors: 7 },
  { week: 'W6', latency: 105, throughput: 950, errors: 10 },
  { week: 'W7', latency: 82, throughput: 1100, errors: 4 },
  { week: 'W8', latency: 78, throughput: 1150, errors: 3 }
]

const PerformanceCategories = computed(() => ({
  latency: {
    name: 'Latency (ms)',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  },
  throughput: {
    name: 'Throughput',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  },
  errors: {
    name: 'Error Count',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  }
}))

const xFormatter = (i: number): string => `${PerformanceData[i]?.week}`
</script>

<template>
  <div class="">
    <LineChart
      :key="colorMode.value"
      :data="PerformanceData"
      :height="height"
      :categories="PerformanceCategories"
      :x-formatter="xFormatter"
      :curve-type="CurveType.Cardinal"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :x-grid-line="false"
      :y-grid-line="true"
      :x-domain-line="true"
      :y-domain-line="false"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-num-ticks="8"
      :y-num-ticks="5"
      x-label="Week"
      y-label="Metrics"
      v-bind="$attrs"
    />
  </div>
</template>
