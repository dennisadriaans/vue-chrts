<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'stacked']
})

const colorMode = useColorMode()

interface StackedAreaItem {
  date: string
  saas: number
  marketplace: number
  services: number
}

const categories: ComputedRef<Record<string, BulletLegendItemInterface>>
  = computed(() => ({
    saas: {
      name: 'SaaS',
      color: '#3b82f6'
    },
    marketplace: {
      name: 'Marketplace',
      color: '#22c55e'
    },
    services: {
      name: 'Services',
      color: '#f59e0b'
    }
  }))

const stackedData: StackedAreaItem[] = [
  { date: 'Jan', saas: 4000, marketplace: 2400, services: 2400 },
  { date: 'Feb', saas: 3000, marketplace: 1398, services: 2210 },
  { date: 'Mar', saas: 2000, marketplace: 9800, services: 2290 },
  { date: 'Apr', saas: 2780, marketplace: 3908, services: 2000 },
  { date: 'May', saas: 1890, marketplace: 4800, services: 2181 },
  { date: 'Jun', saas: 2390, marketplace: 3800, services: 2500 },
  { date: 'Jul', saas: 3490, marketplace: 4300, services: 2100 }
]

const { height } = useResponsiveHeight({
  default: 250,
  sm: 350
})

const xFormatter = (i: number): string => `${stackedData[i]?.date}`
const yFormatter = (value: number): string => `$${value.toLocaleString()}`
</script>

<template>
  <div
    class="mx-auto max-w-3xl space-y-6 rounded-lg"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Area Chart
      </h3>
      <NuxtLink to="/blocks/area-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <AreaChart
      :key="colorMode.value"
      :data="stackedData"
      :height="height"
      :categories="categories"
      :stacked="true"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
      :x-grid-line="false"
    />
  </div>
</template>
