<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartfive']
})

interface PerformanceData {
  quarter: string
  excellent: number
  good: number
  average: number
  needsImprovement: number
}

const chartData = ref<PerformanceData[]>([
  {
    quarter: 'Q1 2024',
    excellent: 32,
    good: 45,
    average: 18,
    needsImprovement: 5
  },
  {
    quarter: 'Q2 2024',
    excellent: 28,
    good: 42,
    average: 22,
    needsImprovement: 8
  },
  {
    quarter: 'Q3 2024',
    excellent: 35,
    good: 48,
    average: 15,
    needsImprovement: 2
  },
  {
    quarter: 'Q4 2024',
    excellent: 41,
    good: 39,
    average: 16,
    needsImprovement: 4
  }
])

const categories: Record<string, BulletLegendItemInterface> = {
  excellent: { name: 'Excellent', color: '#10b981' },
  good: { name: 'Good', color: '#3b82f6' },
  average: { name: 'Average', color: '#f59e0b' },
  needsImprovement: { name: 'Needs Improvement', color: '#ef4444' }
}

const formatPercentage = (tick: number) => {
  return `${tick}%`
}

const xFormatter = (i: number) => `${chartData.value[i]?.quarter}`
const tooltipFormatter = (v: number) => `${v}%`
const tooltipTitleFormatter = (i: number) => `${chartData.value[i]?.quarter}`

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <template #header>
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-lg font-medium">
            Team Performance Distribution
          </h2>
          <p class="text-muted text-sm">
            Quarterly assessment scores across all departments
          </p>
        </div>
      </div>
    </template>

    <BarChart
      :data="chartData"
      :height="height"
      :categories="categories"
      :y-axis="['excellent', 'good', 'average', 'needsImprovement']"
      :y-num-ticks="5"
      :stacked="true"
      :legend-position="LegendPosition.TopRight"
      :x-formatter="xFormatter"
      :y-formatter="formatPercentage"
      :tooltip-formatter="tooltipFormatter"
      :tooltip-title-formatter="tooltipTitleFormatter"
      :y-domain="[0, 100]"
    />

    <template #footer>
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <UButton
            variant="outline"
            trailing-icon="i-lucide-download"
            color="neutral"
          >
            Export Data
          </UButton>
          <UButton
            variant="outline"
            trailing-icon="i-lucide-external-link"
            color="neutral"
          >
            View Details
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
