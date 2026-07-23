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

interface ProductDataItem {
  product: string
  rating: number
}

const ProductRatings: ProductDataItem[] = [
  { product: 'Product A', rating: 4.8 },
  { product: 'Product B', rating: 4.2 },
  { product: 'Product C', rating: 4.9 },
  { product: 'Product D', rating: 3.8 },
  { product: 'Product E', rating: 4.5 },
  { product: 'Product F', rating: 4.1 },
  { product: 'Product G', rating: 4.7 }
]

const RatingCategories = computed(() => ({
  rating: {
    name: 'Rating',
    color: colorMode.value === 'dark' ? '#fbbf24' : '#f59e0b'
  }
}))

const xFormatter = (i: number): string => `${ProductRatings[i]?.product}`
const yFormatter = (value: number): string => `${value.toFixed(1)}★`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="ProductRatings"
    :height="chartHeight"
    :categories="RatingCategories"
    :y-axis="['rating']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="true"
    :y-tick-line="false"
    :x-tick-line="false"
    :radius="16"
    :bar-padding="0.4"
    :x-num-ticks="7"
    :y-num-ticks="6"
    :min-max-ticks-only="false"
    x-label="Products"
    y-label="Customer Rating"
    v-bind="$attrs"
  />
</template>
