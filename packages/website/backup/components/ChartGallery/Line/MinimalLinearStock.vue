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

interface StockDataItem {
  date: string
  price: number
}

const StockData: StockDataItem[] = [
  { date: 'Jan 1', price: 142.5 },
  { date: 'Jan 8', price: 148.2 },
  { date: 'Jan 15', price: 145.8 },
  { date: 'Jan 22', price: 152.4 },
  { date: 'Jan 29', price: 158.7 },
  { date: 'Feb 5', price: 156.3 },
  { date: 'Feb 12', price: 162.9 },
  { date: 'Feb 19', price: 169.5 },
  { date: 'Feb 26', price: 165.8 },
  { date: 'Mar 5', price: 172.4 }
]

const StockCategories = computed(() => ({
  price: {
    name: 'Stock Price',
    color: colorMode.value === 'dark' ? '#06b6d4' : '#0891b2'
  }
}))

const xFormatter = (i: number): string => `${StockData[i]?.date}`
const yFormatter = (value: number): string => `$${value.toFixed(0)}`
</script>

<template>
  <div class="">
    <LineChart
      :key="colorMode.value"
      :data="StockData"
      :height="chartHeight"
      :categories="StockCategories"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :curve-type="CurveType.Linear"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :x-grid-line="false"
      :y-grid-line="false"
      :x-domain-line="false"
      :y-domain-line="false"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-num-ticks="10"
      :y-num-ticks="6"
      :min-max-ticks-only="true"
      x-label="Date"
      y-label="Price"
      v-bind="$attrs"
    />
  </div>
</template>
