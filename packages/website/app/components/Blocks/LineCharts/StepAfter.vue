<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'stepafter']
})

const colorMode = useColorMode()

interface InventoryDataItem {
  day: string
  stock: number
  orders: number
}

const InventoryData: InventoryDataItem[] = [
  { day: 'Mon', stock: 450, orders: 85 },
  { day: 'Tue', stock: 420, orders: 92 },
  { day: 'Wed', stock: 380, orders: 78 },
  { day: 'Thu', stock: 350, orders: 95 },
  { day: 'Fri', stock: 310, orders: 110 },
  { day: 'Sat', stock: 280, orders: 125 },
  { day: 'Sun', stock: 260, orders: 98 }
]

const InventoryCategories = computed(() => ({
  stock: {
    name: 'Stock Level',
    color: 'var(--color-blue-500)'
  },
  orders: {
    name: 'Orders',
    color: 'var(--color-purple-500)'
  }
}))

const xFormatter = (i: number): string => `${InventoryData[i]?.day}`
const yFormatter = (value: number): string => `${value}`
</script>

<template>
  <LineChart
    :key="colorMode.value"
    :data="InventoryData"
    :height="300"
    :categories="InventoryCategories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.StepAfter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-grid-line="false"
    :y-grid-line="true"
    :x-domain-line="true"
    :y-domain-line="false"
    :x-tick-line="false"
    :y-tick-line="true"
    :x-num-ticks="7"
    :y-num-ticks="4"
    :hide-tooltip="false"
    x-label="Day of Week"
    y-label="Count"
  />
</template>
