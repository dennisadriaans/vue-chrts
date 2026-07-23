<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'monotonesmooth']
})

const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})
const colorMode = useColorMode()

interface AreaChartItem {
  month: string
  downloads: number
  installs: number
}

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  downloads: {
    name: 'Downloads',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  },
  installs: {
    name: 'Installs',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  }
}))

const AreaChartData: AreaChartItem[] = [
  { month: 'Jan', downloads: 2400, installs: 1800 },
  { month: 'Feb', downloads: 3200, installs: 2500 },
  { month: 'Mar', downloads: 2800, installs: 2200 },
  { month: 'Apr', downloads: 4100, installs: 3300 },
  { month: 'May', downloads: 3600, installs: 2900 },
  { month: 'Jun', downloads: 4800, installs: 3800 },
  { month: 'Jul', downloads: 5200, installs: 4100 },
  { month: 'Aug', downloads: 4900, installs: 3900 }
]

const xFormatter = (i: number): string => `${AreaChartData[i]?.month}`
const yFormatter = (value: number): string => `${(value / 1000).toFixed(1)}k`
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <AreaChart
      :key="colorMode.value"
      :data="AreaChartData"
      :height="height"
      :categories="categories"
      :curve-type="CurveType.MonotoneX"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="false"
      :y-domain-line="false"
      :x-num-ticks="8"
      :y-num-ticks="4"
      x-label="Month"
      y-label="Count"
    />
  </div>
</template>
