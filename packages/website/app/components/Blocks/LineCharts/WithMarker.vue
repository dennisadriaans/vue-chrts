<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'withmarker']
})

const colorMode = useColorMode()

interface FinanceData {
  month: string
  revenue: number
  expenses: number
}

const chartData = ref<FinanceData[]>([
  { month: 'Jul', revenue: 155, expenses: 78 },
  { month: 'Aug', revenue: 142, expenses: 70 },
  { month: 'Sep', revenue: 132, expenses: 60 },
  { month: 'Oct', revenue: 135, expenses: 60 },
  { month: 'Nov', revenue: 130, expenses: 56 },
  { month: 'Dec', revenue: 120, expenses: 50 }
])

const chartCategories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  revenue: {
    name: 'Revenue',
    color: colorMode.value === 'dark' ? '#60a5fa' : '#3b82f6'
  },
  expenses: {
    name: 'Expenses',
    color: colorMode.value === 'dark' ? '#34d399' : '#10b981'
  }
}))

const xAxisFormatter = (tick: number): string => {
  return chartData.value[tick]?.month ?? ''
}

const yAxisFormatter = (value: number): string => {
  return `$${value}k`
}

const markerConfig = computed(() => {
  const revenueColor = Array.isArray(chartCategories.value.revenue?.color) ? chartCategories.value.revenue.color[0] : (chartCategories.value.revenue?.color ?? '')
  const expensesColor = Array.isArray(chartCategories.value.expenses?.color) ? chartCategories.value.expenses.color[0] : (chartCategories.value.expenses?.color ?? '')

  return {
    id: 'main-chart',
    config: {
      revenue: {
        type: 'circle' as const,
        size: 8,
        color: colorMode.value === 'dark' ? '#000' : '#fff',
        strokeColor: revenueColor,
        strokeWidth: 2
      },
      expenses: {
        type: 'circle' as const,
        size: 8,
        color: colorMode.value === 'dark' ? '#000' : '#fff',
        strokeColor: expensesColor,
        strokeWidth: 2
      }
    }
  }
})

const { height } = useResponsiveHeight({
  default: 140,
  sm: 260
})
</script>

<template>
  <UCard>
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-medium">
          Revenue Trends
        </h2>
        <p class="text-muted text-sm">
          A monthly overview of revenue vs operating expenses.
        </p>
      </div>

      <UCard>
        <LineChart
          :data="chartData"
          :height="height"
          :categories="chartCategories"
          :x-num-ticks="6"
          :x-formatter="xAxisFormatter"
          :y-formatter="yAxisFormatter"
          :legend-position="LegendPosition.TopRight"
          :y-grid-line="true"
          :x-grid-line="true"
          :marker-config="markerConfig"
        />
      </UCard>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span class="text-muted text-sm">Automated Sync</span>
        </div>
        <div class="flex gap-2">
          <UButton
            variant="ghost"
            color="neutral"
          >
            Report
            <template #leading>
              <UIcon
                name="i-lucide-file-text"
                class="size-4 text-default"
              />
            </template>
          </UButton>
          <UButton
            variant="ghost"
            color="neutral"
          >
            Add Entry
            <template #leading>
              <UIcon
                name="i-lucide-plus"
                class="size-4 text-default"
              />
            </template>
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
/* Stroke maps to color key in categories */
#main-chart :deep(*[stroke='#60a5fa']),
#main-chart :deep(*[stroke='#3b82f6']) {
  marker: url('#main-chart-revenue');
}

#main-chart :deep(*[stroke='#34d399']),
#main-chart :deep(*[stroke='#10b981']) {
  marker: url('#main-chart-expenses');
}
</style>
