<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'charteleven']
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

const { height } = useResponsiveHeight({
  default: 180,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <template #header>
      <h3 class="text-lg font-semibold">
        Revenue
      </h3>
    </template>

    <BarChart
      :key="colorMode.value"
      :data="SalesData"
      :height="height"
      :categories="SalesCategories"
      x-axis="product"
      :y-axis="['sales']"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.BottomRight"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="false"
      :y-domain-line="false"
      :x-domain-line="false"
      :y-tick-line="false"
      :x-tick-line="false"
      :radius="8"
      :bar-padding="0.3"
      y-label="Revenue"
      :value-label="{
        label: (d: any) => {
          return d.y > 0 ? (d.y / 1000).toString() : undefined
        },
        labelSpacing: 250,
        color: 'var(--ui-text)',
        labelFontSize: 12
      }"
    />
  </UCard>
</template>
