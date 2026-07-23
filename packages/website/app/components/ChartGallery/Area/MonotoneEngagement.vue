<script lang="ts" setup>
interface Props {
  height: number
}

const { height } = defineProps<Props>()

const colorMode = useColorMode()

interface EngagementDataItem {
  week: string
  likes: number
  comments: number
  shares: number
  saves: number
}

const EngagementData: EngagementDataItem[] = [
  { week: 'W1', likes: 1240, comments: 320, shares: 180, saves: 420 },
  { week: 'W2', likes: 1580, comments: 410, shares: 250, saves: 580 },
  { week: 'W3', likes: 1420, comments: 380, shares: 210, saves: 520 },
  { week: 'W4', likes: 1890, comments: 520, shares: 340, saves: 680 },
  { week: 'W5', likes: 2140, comments: 610, shares: 420, saves: 780 },
  { week: 'W6', likes: 1960, comments: 560, shares: 380, saves: 720 },
  { week: 'W7', likes: 2340, comments: 680, shares: 480, saves: 860 }
]

const EngagementCategories = computed(() => ({
  likes: {
    name: 'Likes',
    color: colorMode.value === 'dark' ? '#fb7185' : '#f43f5e'
  },
  comments: {
    name: 'Comments',
    color: colorMode.value === 'dark' ? '#60a5fa' : '#3b82f6'
  },
  shares: {
    name: 'Shares',
    color: colorMode.value === 'dark' ? '#34d399' : '#10b981'
  },
  saves: {
    name: 'Saves',
    color: colorMode.value === 'dark' ? '#fcd34d' : '#fbbf24'
  }
}))

const xFormatter = (i: number): string => `${EngagementData[i]?.week}`
const yFormatter = (value: number): string => `${(value / 1000).toFixed(1)}k`
</script>

<template>
  <AreaChart
    :key="colorMode.value"
    :data="EngagementData"
    :height="height"
    :categories="EngagementCategories"
    :curve-type="CurveType.MonotoneX"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="true"
    :x-tick-line="true"
    :y-tick-line="true"
    :x-num-ticks="7"
    :y-num-ticks="4"
    x-label="Week"
    y-label="Engagement"
    v-bind="$attrs"
  />
</template>
