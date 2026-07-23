<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const colorMode = useColorMode()

interface MetricDataItem {
  time: string
  cpu: number
}

const MetricData = ref<MetricDataItem[]>([
  { time: '00:00', cpu: 45 },
  { time: '01:00', cpu: 48 },
  { time: '02:00', cpu: 52 },
  { time: '03:00', cpu: 55 },
  { time: '04:00', cpu: 52 },
  { time: '05:00', cpu: 48 },
  { time: '06:00', cpu: 60 },
  { time: '07:00', cpu: 70 },
  { time: '08:00', cpu: 78 },
  { time: '09:00', cpu: 72 },
  { time: '10:00', cpu: 68 },
  { time: '11:00', cpu: 65 },
  { time: '12:00', cpu: 65 },
  { time: '13:00', cpu: 70 }
])

const MetricCategories = computed(() => ({
  cpu: {
    name: 'CPU Usage',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  }
}))

const xFormatter = (i: number): string => `${MetricData.value[i]?.time || ''}`
const yFormatter = (value: number): string => `${value}%`

let interval: ReturnType<typeof setInterval>
let currentHour = 13

onMounted(() => {
  interval = setInterval(() => {
    currentHour += 1
    const displayHour = currentHour % 24
    const timeStr = `${displayHour.toString().padStart(2, '0')}:00`

    const lastCpu = MetricData.value[MetricData.value.length - 1].cpu
    const newCpu = Math.max(45, Math.min(78, lastCpu + (Math.random() * 20 - 10)))

    // 1. Add the new record
    MetricData.value.push({
      time: timeStr,
      cpu: Math.round(newCpu)
    })

    // 2. Remove the oldest record if the limit is exceeded
    // Keep it at 14 records to match your initial state
    if (MetricData.value.length > 14) {
      MetricData.value.shift()
    }
  }, 6000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="MetricData"
    :height="160"
    :categories="MetricCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Step"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="true"
    :y-grid-line="true"
    :x-domain-line="false"
    :y-domain-line="false"
    :y-num-ticks="2"
    :hide-tooltip="false"
    :duration="1000"
    x-label="Time of Day"
  />
</template>
