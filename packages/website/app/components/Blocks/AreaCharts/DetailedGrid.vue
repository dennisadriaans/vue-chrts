<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'detailedgrid']
})

const colorMode = useColorMode()

interface AreaChartItem {
  day: string
  temperature: number
  humidity: number
  pressure: number
}

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  temperature: {
    name: 'Temperature (°C)',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  },
  humidity: {
    name: 'Humidity (%)',
    color: colorMode.value === 'dark' ? '#06b6d4' : '#0891b2'
  },
  pressure: {
    name: 'Pressure (hPa)',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  }
}))

const AreaChartData: AreaChartItem[] = [
  { day: 'Mon', temperature: 22, humidity: 65, pressure: 1013 },
  { day: 'Tue', temperature: 25, humidity: 70, pressure: 1015 },
  { day: 'Wed', temperature: 19, humidity: 80, pressure: 1008 },
  { day: 'Thu', temperature: 28, humidity: 55, pressure: 1020 },
  { day: 'Fri', temperature: 24, humidity: 62, pressure: 1012 },
  { day: 'Sat', temperature: 26, humidity: 58, pressure: 1018 },
  { day: 'Sun', temperature: 21, humidity: 75, pressure: 1010 }
]

const xFormatter = (i: number): string => `${AreaChartData[i]?.day}`
</script>

<template>
  <AreaChart
    :key="colorMode.value"
    :data="AreaChartData"
    :height="300"
    :categories="categories"
    :curve-type="CurveType.Cardinal"
    :x-formatter="xFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-domain-line="true"
    :x-domain-line="true"
    :x-tick-line="true"
    :x-num-ticks="7"
    :y-num-ticks="6"
    x-label="Day of Week"
    y-label="Values"
  />
</template>
