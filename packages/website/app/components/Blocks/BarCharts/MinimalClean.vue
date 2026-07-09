<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'minimalclean']
})

const colorMode = useColorMode()

interface SalesDataItem {
  product: string
  sales: number
}

const SalesData: SalesDataItem[] = [
  { product: 'Widgets', sales: 2400 },
  { product: 'Gadgets', sales: 1800 },
  { product: 'Tools', sales: 3200 },
  { product: 'Parts', sales: 2100 },
  { product: 'Kits', sales: 2800 }
]

const SalesCategories = computed(() => ({
  sales: {
    name: 'Sales Revenue',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  }
}))

const xFormatter = (i: number): string => `${SalesData[i]?.product}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="SalesData"
    :height="300"
    :categories="SalesCategories"
    :y-axis="['sales']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :min-max-ticks-only="true"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
    :y-tick-line="false"
    :x-tick-line="false"
    :radius="8"
    :bar-padding="0.3"
    x-label="Products"
    y-label="Revenue"
  />
</template>
