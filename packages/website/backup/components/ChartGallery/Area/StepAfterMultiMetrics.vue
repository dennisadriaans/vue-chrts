<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

interface Props {
  height?: number
  actOnResponsiveHeight?: boolean
}

const { height, actOnResponsiveHeight = true } = defineProps<Props>()

const colorMode = useColorMode()
const { height: responsiveHeight } = useResponsiveHeight({
  default: 200,
  sm: 300
})

const chartHeight = computed(() => {
  if (actOnResponsiveHeight) {
    return responsiveHeight.value
  }

  return height ?? responsiveHeight.value
})

interface SystemMetricsItem {
  time: string
  cpu: number
  memory: number
  network: number
}

const SystemMetricsData: SystemMetricsItem[] = [
  { time: '00:00', cpu: 45, memory: 62, network: 28 },
  { time: '04:00', cpu: 32, memory: 58, network: 18 },
  { time: '08:00', cpu: 68, memory: 75, network: 52 },
  { time: '12:00', cpu: 82, memory: 88, network: 68 },
  { time: '16:00', cpu: 76, memory: 82, network: 58 },
  { time: '20:00', cpu: 58, memory: 70, network: 42 },
  { time: '23:59', cpu: 48, memory: 64, network: 32 }
]

const SystemCategories = computed(() => ({
  cpu: {
    name: 'CPU Usage',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  },
  memory: {
    name: 'Memory Usage',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  network: {
    name: 'Network I/O',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  }
}))

const xFormatter = (i: number): string => `${SystemMetricsData[i]?.time}`
const yFormatter = (value: number): string => `${value}%`
</script>

<template>
  <AreaChart
    :key="colorMode.value"
    :data="SystemMetricsData"
    :height="chartHeight"
    :categories="SystemCategories"
    :curve-type="CurveType.StepAfter"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-domain-line="true"
    :x-domain-line="true"
    :x-tick-line="true"
    :y-tick-line="false"
    :x-num-ticks="7"
    :y-num-ticks="5"
    x-label="Time (24h)"
    y-label="Usage %"
    v-bind="$attrs"
  />
</template>
