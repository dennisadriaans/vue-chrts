<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'naturalcurve']
})

const colorMode = useColorMode()

interface GrowthDataItem {
  period: string
  users: number
  sessions: number
}

const GrowthData: GrowthDataItem[] = [
  { period: 'Week 1', users: 1250, sessions: 3800 },
  { period: 'Week 2', users: 1420, sessions: 4200 },
  { period: 'Week 3', users: 1680, sessions: 5100 },
  { period: 'Week 4', users: 1580, sessions: 4800 },
  { period: 'Week 5', users: 1890, sessions: 5600 },
  { period: 'Week 6', users: 2150, sessions: 6400 },
  { period: 'Week 7', users: 2340, sessions: 7100 },
  { period: 'Week 8', users: 2120, sessions: 6300 },
  { period: 'Week 9', users: 2480, sessions: 7800 },
  { period: 'Week 10', users: 2650, sessions: 8200 }
]

const GrowthCategories = computed(() => ({
  users: {
    name: 'Active Users',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  },
  sessions: {
    name: 'Sessions',
    color: colorMode.value === 'dark' ? '#06b6d4' : '#0891b2'
  }
}))

const xFormatter = (i: number): string => `${GrowthData[i]?.period}`
const yFormatter = (value: number): string => `${(value / 1000).toFixed(1)}k`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="GrowthData"
    :height="300"
    :categories="GrowthCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Natural"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="false"
    :y-grid-line="true"
    :x-domain-line="true"
    :y-domain-line="false"
    :x-tick-line="false"
    :y-tick-line="true"
    :x-num-ticks="5"
    :y-num-ticks="5"
    :hide-tooltip="false"
    x-label="Time Period"
    y-label="Count"
  />
</template>
