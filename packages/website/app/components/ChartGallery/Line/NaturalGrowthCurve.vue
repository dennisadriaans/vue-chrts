<script lang="ts" setup>
interface Props {
  height: number
}

const { height } = defineProps<Props>()

const colorMode = useColorMode()

interface GrowthDataItem {
  month: string
  organic: number
  paid: number
}

const GrowthData: GrowthDataItem[] = [
  { month: 'Jan', organic: 1200, paid: 800 },
  { month: 'Feb', organic: 1580, paid: 1100 },
  { month: 'Mar', organic: 2100, paid: 1400 },
  { month: 'Apr', organic: 2680, paid: 1850 },
  { month: 'May', organic: 3420, paid: 2300 },
  { month: 'Jun', organic: 4250, paid: 2900 },
  { month: 'Jul', organic: 5180, paid: 3600 },
  { month: 'Aug', organic: 6300, paid: 4400 }
]

const GrowthCategories = computed(() => ({
  organic: {
    name: 'Organic Growth',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  },
  paid: {
    name: 'Paid Acquisition',
    color: colorMode.value === 'dark' ? '#ec4899' : '#db2777'
  }
}))

const xFormatter = (i: number): string => `${GrowthData[i]?.month}`
const yFormatter = (value: number): string => `${(value / 1000).toFixed(1)}k`
</script>

<template>
  <div class="">
    <LineChart
      :key="colorMode.value"
      :data="GrowthData"
      :height="height"
      :categories="GrowthCategories"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :curve-type="CurveType.Natural"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :x-grid-line="false"
      :y-grid-line="true"
      :x-domain-line="false"
      :y-domain-line="false"
      :x-tick-line="true"
      :y-tick-line="false"
      :x-num-ticks="8"
      :y-num-ticks="4"
      x-label="Month"
      y-label="Users"
      v-bind="$attrs"
    />
  </div>
</template>
