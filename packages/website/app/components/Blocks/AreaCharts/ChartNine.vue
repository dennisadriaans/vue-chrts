<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'chartnine']
})

const colorMode = useColorMode()

interface AreaChartItem {
  quarter: string
  revenue: number
  expenses: number
}

const categories = computed(() => ({
  revenue: {
    name: 'Revenue',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  expenses: {
    name: 'Expenses',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  }
}))

const AreaChartData: AreaChartItem[] = [
  { quarter: 'Q1 2024', revenue: 4200, expenses: 2800 },
  { quarter: 'Q2 2024', revenue: 5100, expenses: 3200 },
  { quarter: 'Q3 2024', revenue: 3900, expenses: 2900 },
  { quarter: 'Q4 2024', revenue: 6800, expenses: 4100 }
]

const xFormatter = (i: number): string => `${AreaChartData[i]?.quarter}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold">
            Quarterly Revenue & Expenses
          </h3>
          <p class="text-muted text-sm">
            Compare revenue and expenses per quarter
          </p>
        </div>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            icon="i-hugeicons:sparkles"
            variant="ghost"
            color="neutral"
          />
        </NuxtLink>
      </div>

      <UCard variant="soft">
        <AreaChart
          :key="colorMode.value"
          :data="AreaChartData"
          :height="height"
          :categories="categories"
          :curve-type="CurveType.Step"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
          :y-grid-line="false"
          :x-grid-line="true"
          :x-num-ticks="4"
          :y-num-ticks="5"
          x-label="Quarter"
          y-label="Amount"
        />
        <div class="text-dimmed mt-6 text-center text-xs">
          <span>Tip: Click legend items to compare revenue and expenses.</span>
        </div>
      </UCard>
    </div>
  </UCard>
</template>
