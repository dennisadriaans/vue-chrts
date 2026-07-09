<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'radiusstyled']
})

const colorMode = useColorMode()

interface CategoryDataItem {
  category: string
  mobile: number
  tablet: number
  desktop: number
}

const CategoryData: CategoryDataItem[] = [
  { category: 'Games', mobile: 340, tablet: 180, desktop: 280 },
  { category: 'Social', mobile: 420, tablet: 200, desktop: 150 },
  { category: 'News', mobile: 280, tablet: 240, desktop: 380 },
  { category: 'Shopping', mobile: 380, tablet: 160, desktop: 320 },
  { category: 'Travel', mobile: 220, tablet: 140, desktop: 260 }
]

const CategoryCategories = computed(() => ({
  mobile: {
    name: 'Mobile',
    color: '#22c55e' // green-500
  },
  tablet: {
    name: 'Tablet',
    color: '#3b82f6' // blue-500
  },
  desktop: {
    name: 'Desktop',
    color: '#a855f7' // purple-500
  }
}))

const xFormatter = (i: number): string => `${CategoryData[i]?.category}`
const yFormatter = (value: number): string => `${value}k`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="CategoryData"
    :height="300"
    :categories="CategoryCategories"
    :y-axis="['mobile', 'tablet', 'desktop']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :radius="12"
    :group-padding="0.2"
    :bar-padding="0.15"
    :x-num-ticks="5"
    :y-num-ticks="5"
    x-label="App Categories"
    y-label="Downloads"
  />
</template>
