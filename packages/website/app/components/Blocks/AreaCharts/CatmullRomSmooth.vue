<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'catmullromsmooth']
})

const colorMode = useColorMode()
const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})

interface SensorDataItem {
  timestamp: string
  temperature: number
  humidity: number
}

const SensorData: SensorDataItem[] = [
  { timestamp: '08:00', temperature: 22.5, humidity: 45 },
  { timestamp: '10:00', temperature: 24.2, humidity: 42 },
  { timestamp: '12:00', temperature: 27.8, humidity: 38 },
  { timestamp: '14:00', temperature: 29.1, humidity: 35 },
  { timestamp: '16:00', temperature: 26.4, humidity: 40 },
  { timestamp: '18:00', temperature: 23.7, humidity: 48 },
  { timestamp: '20:00', temperature: 21.3, humidity: 52 }
]

const SensorCategories = computed(() => ({
  temperature: {
    name: 'Temperature (°C)',
    color: '#ef4444' // red-500
  },
  humidity: {
    name: 'Humidity (%)',
    color: '#06b6d4' // cyan-500
  }
}))

const xFormatter = (i: number): string => `${SensorData[i]?.timestamp}`
const yFormatter = (value: number): string => `${value.toFixed(1)}`
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <AreaChart
      :key="colorMode.value"
      :data="SensorData"
      :height="height"
      :categories="SensorCategories"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :curve-type="CurveType.CatmullRom"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :x-grid-line="true"
      :y-grid-line="true"
      :x-domain-line="false"
      :y-domain-line="false"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-num-ticks="7"
      :y-num-ticks="4"
      :hide-tooltip="false"
      x-label="Time"
      y-label="Readings"
    />
  </div>
</template>
