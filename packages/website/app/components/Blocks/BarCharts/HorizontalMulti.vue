<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'horizontalmulti']
})

const colorMode = useColorMode()

interface RegionDataItem {
  region: string
  q1: number
  q2: number
  q3: number
  q4: number
}

const RegionData: RegionDataItem[] = [
  { region: 'North America', q1: 450, q2: 520, q3: 480, q4: 600 },
  { region: 'Europe', q1: 380, q2: 420, q3: 460, q4: 510 },
  { region: 'Asia Pacific', q1: 320, q2: 390, q3: 440, q4: 520 },
  { region: 'Latin America', q1: 180, q2: 210, q3: 240, q4: 280 },
  { region: 'Middle East', q1: 120, q2: 150, q3: 170, q4: 200 }
]

const RegionCategories = computed(() => ({
  q1: {
    name: 'Q1',
    color: '#ef4444' // red-500
  },
  q2: {
    name: 'Q2',
    color: '#f59e0b' // amber-500
  },
  q3: {
    name: 'Q3',
    color: '#22c55e' // green-500
  },
  q4: {
    name: 'Q4',
    color: '#3b82f6' // blue-500
  }
}))

const yFormatter = (i: number): string => `${RegionData[i]?.region}`
const xFormatter = (value: number): string => `$${value}k`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="RegionData"
    :height="300"
    :categories="RegionCategories"
    :y-axis="['q1', 'q2', 'q3', 'q4']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :orientation="Orientation.Horizontal"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="true"
    :y-grid-line="false"
    :x-domain-line="true"
    :y-domain-line="true"
    :x-tick-line="true"
    :y-tick-line="false"
    :radius="4"
    :group-padding="0.1"
    :bar-padding="0.05"
    :x-num-ticks="6"
    :y-num-ticks="5"
    x-label="Revenue"
    y-label="Regions"
  />
</template>
