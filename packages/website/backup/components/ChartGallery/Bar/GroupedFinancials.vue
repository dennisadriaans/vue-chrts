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

interface QuarterlyDataItem {
  quarter: string
  revenue: number
  costs: number
  profit: number
}

const QuarterlyData: QuarterlyDataItem[] = [
  { quarter: 'Q1 23', revenue: 8400, costs: 5200, profit: 3200 },
  { quarter: 'Q2 23', revenue: 9600, costs: 5800, profit: 3800 },
  { quarter: 'Q3 23', revenue: 11200, costs: 6400, profit: 4800 },
  { quarter: 'Q4 23', revenue: 13400, costs: 7200, profit: 6200 },
  { quarter: 'Q1 24', revenue: 15800, costs: 8100, profit: 7700 },
  { quarter: 'Q2 24', revenue: 17200, costs: 8900, profit: 8300 }
]

const QuarterlyCategories = computed(() => ({
  revenue: {
    name: 'Revenue',
    color: colorMode.value === 'dark' ? '#06b6d4' : '#0891b2'
  },
  costs: {
    name: 'Costs',
    color: colorMode.value === 'dark' ? '#f97316' : '#ea580c'
  },
  profit: {
    name: 'Profit',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  }
}))

const xFormatter = (i: number): string => `${QuarterlyData[i]?.quarter}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(0)}k`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="QuarterlyData"
    :height="chartHeight"
    :categories="QuarterlyCategories"
    :y-axis="['revenue', 'costs', 'profit']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
    :y-tick-line="false"
    :x-tick-line="false"
    :radius="6"
    :group-padding="0.15"
    :bar-padding="0.2"
    :x-num-ticks="6"
    :y-num-ticks="6"
    x-label="Quarter"
    y-label="Amount"
    v-bind="$attrs"
  />
</template>
