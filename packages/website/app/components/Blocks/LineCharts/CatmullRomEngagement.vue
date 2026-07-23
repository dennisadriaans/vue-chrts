<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'catmullromengagement']
})

const colorMode = useColorMode()

interface EngagementDataItem {
  timestamp: string
  pageviews: number
  clicks: number
  shares: number
  comments: number
}

const EngagementData: EngagementDataItem[] = [
  { timestamp: '06:00', pageviews: 850, clicks: 145, shares: 32, comments: 18 },
  {
    timestamp: '09:00',
    pageviews: 1420,
    clicks: 280,
    shares: 68,
    comments: 42
  },
  {
    timestamp: '12:00',
    pageviews: 2180,
    clicks: 450,
    shares: 125,
    comments: 88
  },
  {
    timestamp: '15:00',
    pageviews: 1950,
    clicks: 380,
    shares: 95,
    comments: 65
  },
  {
    timestamp: '18:00',
    pageviews: 2650,
    clicks: 520,
    shares: 145,
    comments: 102
  },
  {
    timestamp: '21:00',
    pageviews: 2320,
    clicks: 465,
    shares: 118,
    comments: 78
  },
  {
    timestamp: '00:00',
    pageviews: 1280,
    clicks: 220,
    shares: 52,
    comments: 35
  },
  { timestamp: '03:00', pageviews: 720, clicks: 115, shares: 28, comments: 15 }
]

const EngagementCategories = computed(() => ({
  pageviews: {
    name: 'Page Views',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  clicks: {
    name: 'Clicks',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  },
  shares: {
    name: 'Social Shares',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  },
  comments: {
    name: 'Comments',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  }
}))

const xFormatter = (i: number): string => `${EngagementData[i]?.timestamp}`
const yFormatter = (value: number): string =>
  `${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="EngagementData"
    :height="300"
    :categories="EngagementCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.CatmullRom"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="true"
    :y-grid-line="true"
    :x-domain-line="true"
    :y-domain-line="false"
    :x-tick-line="true"
    :y-tick-line="true"
    :x-num-ticks="8"
    :y-num-ticks="6"
    :hide-tooltip="false"
    x-label="Time of Day"
    y-label="Engagement"
  />
</template>
