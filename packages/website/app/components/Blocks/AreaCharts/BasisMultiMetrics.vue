<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'basismultimetrics']
})

const colorMode = useColorMode()
const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})

interface MetricsDataItem {
  date: string
  engagement: number
  conversions: number
  retention: number
  satisfaction: number
}

const MetricsData: MetricsDataItem[] = [
  {
    date: 'Mon',
    engagement: 68,
    conversions: 42,
    retention: 85,
    satisfaction: 78
  },
  {
    date: 'Tue',
    engagement: 72,
    conversions: 48,
    retention: 88,
    satisfaction: 82
  },
  {
    date: 'Wed',
    engagement: 65,
    conversions: 38,
    retention: 82,
    satisfaction: 75
  },
  {
    date: 'Thu',
    engagement: 78,
    conversions: 55,
    retention: 91,
    satisfaction: 86
  },
  {
    date: 'Fri',
    engagement: 82,
    conversions: 62,
    retention: 94,
    satisfaction: 89
  },
  {
    date: 'Sat',
    engagement: 76,
    conversions: 52,
    retention: 89,
    satisfaction: 84
  },
  {
    date: 'Sun',
    engagement: 70,
    conversions: 45,
    retention: 86,
    satisfaction: 80
  }
]

const MetricsCategories = computed(() => ({
  engagement: {
    name: 'Engagement Score',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  },
  conversions: {
    name: 'Conversion Rate',
    color: colorMode.value === 'dark' ? '#06b6d4' : '#0891b2'
  },
  retention: {
    name: 'User Retention',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  },
  satisfaction: {
    name: 'Satisfaction Index',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  }
}))

const xFormatter = (i: number): string => `${MetricsData[i]?.date}`
const yFormatter = (value: number): string => `${value}%`
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <AreaChart
      :key="colorMode.value"
      :data="MetricsData"
      :height="height"
      :categories="MetricsCategories"
      :curve-type="CurveType.Basis"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="true"
      :y-domain-line="true"
      :x-domain-line="true"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-num-ticks="7"
      :y-num-ticks="5"
      x-label="Day"
      y-label="Performance %"
    />
  </div>
</template>
