<script lang="ts" setup>
interface Props {
  height: number
}

const { height } = defineProps<Props>()

const colorMode = useColorMode()

interface RevenueDataItem {
  period: string
  subscriptions: number
  services: number
  products: number
}

const RevenueData: RevenueDataItem[] = [
  {
    period: 'Q1',
    subscriptions: 4200,
    services: 3100,
    products: 2400
  },
  {
    period: 'Q2',
    subscriptions: 5800,
    services: 4200,
    products: 3800
  },
  {
    period: 'Q3',
    subscriptions: 7200,
    services: 5500,
    products: 4600
  },
  {
    period: 'Q4',
    subscriptions: 6800,
    services: 4800,
    products: 4200
  },
  {
    period: 'Q1',
    subscriptions: 8400,
    services: 6200,
    products: 5100
  },
  {
    period: 'Q2',
    subscriptions: 9600,
    services: 7400,
    products: 6300
  }
]

const RevenueCategories = computed(() => ({
  subscriptions: {
    name: 'Subscriptions',
    color: colorMode.value === 'dark' ? '#a78bfa' : '#8b5cf6'
  },
  services: {
    name: 'Services',
    color: colorMode.value === 'dark' ? '#34d399' : '#10b981'
  },
  products: {
    name: 'Products',
    color: colorMode.value === 'dark' ? '#fbbf24' : '#f59e0b'
  }
}))

const xFormatter = (i: number): string => `${RevenueData[i]?.period}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`
</script>

<template>
  <AreaChart
    :key="colorMode.value"
    :data="RevenueData"
    :height="height"
    :categories="RevenueCategories"
    :curve-type="CurveType.Natural"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="false"
    :x-domain-line="false"
    :x-tick-line="false"
    :y-tick-line="false"
    :x-num-ticks="6"
    :y-num-ticks="6"
    x-label="Quarter"
    y-label="Revenue"
    v-bind="$attrs"
  />
</template>
