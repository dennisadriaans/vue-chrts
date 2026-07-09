<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'chartfour']
})

interface AreaChartItem {
  date: string
  desktop: number
  mobile: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  mobile: { name: 'Mobile' }
}

const BarChartData: AreaChartItem[] = [
  { date: '2024-04-01', desktop: 222, mobile: 15 },
  { date: '2024-04-02', desktop: 180, mobile: 12 },
  { date: '2024-04-03', desktop: 167, mobile: 9 },
  { date: '2024-04-04', desktop: 172, mobile: 18 },
  { date: '2024-04-05', desktop: 184, mobile: 22 },
  { date: '2024-04-06', desktop: 195, mobile: 16 },
  { date: '2024-04-07', desktop: 198, mobile: 14 },
  { date: '2024-04-08', desktop: 205, mobile: 19 },
  { date: '2024-04-09', desktop: 210, mobile: 21 },
  { date: '2024-04-10', desktop: 219, mobile: 17 },
  { date: '2024-04-11', desktop: 224, mobile: 13 },
  { date: '2024-04-12', desktop: 230, mobile: 20 }
]

const xFormatter = (tick: number, i?: number, _ticks?: number[]): string => {
  const index = typeof i === 'number' ? i : tick
  if (!BarChartData[index]?.date) {
    return ''
  }
  const date = new Date(BarChartData[index].date)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const totalMobileRevenue = computed(() => {
  return BarChartData.reduce((sum, item) => sum + item.mobile, 0)
})

const averageMobileRevenue = computed(() => {
  return Math.round(totalMobileRevenue.value / BarChartData.length)
})

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})

const tooltipTitleFormatter = (data: AreaChartItem) => {
  return new Date(data.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const tooltipFormatter = (value: number) => `$${value.toLocaleString()}`
</script>

<template>
  <UCard class="bg-default!">
    <div class="relative">
      <div class="pt-2">
        <div class="mb-6 flex items-start justify-between">
          <div>
            <h2 class="text-default text-xl font-semibold">
              Revenue Monitoring
            </h2>
            <p class="text-muted">
              Last 12 days performance
            </p>
          </div>
          <div class="flex items-center gap-1.5">
            <UButton
              variant="ghost"
              icon="i-lucide-more-vertical"
              color="neutral"
            />
          </div>
        </div>
      </div>
    </div>

    <UCard variant="soft">
      <BarChart
        :data="BarChartData"
        :height="height"
        :categories="categories"
        :y-axis="['mobile']"
        :group-padding="0.1"
        :bar-padding="0.3"
        :y-num-ticks="5"
        :min-max-ticks-only="false"
        :y-grid-line="true"
        :x-formatter="xFormatter"
        :tooltip-title-formatter="tooltipTitleFormatter"
        :tooltip-formatter="tooltipFormatter"
        :legend-position="LegendPosition.TopRight"
        class="px-4"
      />
    </UCard>
    <!-- Enhanced Footer -->
    <template #footer>
      <div>
        <!-- Stats Row -->
        <div class="mb-4 grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-muted mb-1">
              Total Revenue
            </p>
            <p class="text-default font-semibold">
              ${{ totalMobileRevenue }}
            </p>
          </div>
          <div class="border-muted border-x text-center">
            <p class="text-muted mb-1">
              Daily Average
            </p>
            <p class="text-default font-semibold">
              ${{ averageMobileRevenue }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-muted mb-1">
              Days Tracked
            </p>
            <p class="text-default font-semibold">
              {{ BarChartData.length }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="border-muted flex items-center justify-between border-t pt-4"
        >
          <div class="flex items-center gap-2">
            <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
            <span class="text-muted">Mobile revenue</span>
          </div>
          <div class="flex gap-2">
            <UButton
              variant="soft"
              icon="i-lucide-arrow-right"
              trailing
              color="primary"
            >
              View Details
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>
