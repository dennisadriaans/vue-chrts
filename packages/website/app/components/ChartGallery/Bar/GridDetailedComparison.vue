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

interface MetricDataItem {
  category: string
  current: number
  previous: number
}

const ComparisonData: MetricDataItem[] = [
  { category: 'Traffic', current: 14200, previous: 12800 },
  { category: 'Signups', current: 3400, previous: 2900 },
  { category: 'Conversions', current: 820, previous: 680 },
  { category: 'Revenue', current: 98000, previous: 82000 },
  { category: 'Active Users', current: 8600, previous: 7400 }
]

const ComparisonCategories = computed(() => ({
  current: {
    name: 'Current Period',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  },
  previous: {
    name: 'Previous Period',
    color: colorMode.value === 'dark' ? '#64748b' : '#475569'
  }
}))

const xFormatter = (i: number): string => `${ComparisonData[i]?.category}`
const yFormatter = (value: number): string => {
  if (value >= 10000) return `${(value / 1000).toFixed(0)}k`
  return value.toString()
}
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="ComparisonData"
    :height="chartHeight"
    :categories="ComparisonCategories"
    :y-axis="['current', 'previous']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-domain-line="false"
    :x-domain-line="false"
    :y-tick-line="true"
    :x-tick-line="true"
    :radius="4"
    :group-padding="0.1"
    :bar-padding="0.15"
    :x-num-ticks="5"
    :y-num-ticks="4"
    x-label="Metrics"
    y-label="Value"
    v-bind="$attrs"
  />
</template>
