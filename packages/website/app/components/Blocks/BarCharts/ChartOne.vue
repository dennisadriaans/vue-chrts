<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartone']
})

interface SpendingData {
  month: string
  amount: number
}

const chartData = ref<SpendingData[]>([
  {
    month: formatDate(new Date('2025-01-01')),
    amount: 2500
  },
  {
    month: formatDate(new Date('2025-02-01')),
    amount: 1500 },
  {
    month: formatDate(new Date('2025-03-01')),
    amount: 3000 },
  {
    month: formatDate(new Date('2025-04-01')),
    amount: 4000 },
  {
    month: formatDate(new Date('2025-05-01')),
    amount: 4500 },
  {
    month: formatDate(new Date('2025-06-01')),
    amount: 2800 },
  {
    month: formatDate(new Date('2025-07-01')),
    amount: 3500 },
  {
    month: formatDate(new Date('2025-08-01')),
    amount: 3800 },
  {
    month: formatDate(new Date('2025-09-01')),
    amount: 2000 },
  {
    month: formatDate(new Date('2025-10-01')),
    amount: 4200 },
  {
    month: formatDate(new Date('2025-11-01')),
    amount: 2200 },
  {
    month: formatDate(new Date('2025-12-01')),
    amount: 1800 },
  {
    month: formatDate(new Date('2025-06-01')),
    amount: 2800 },
  {
    month: formatDate(new Date('2025-07-01')),
    amount: 3500 },
  {
    month: formatDate(new Date('2025-08-01')),
    amount: 3800 },
  {
    month: formatDate(new Date('2025-09-01')),
    amount: 2000 },
  {
    month: formatDate(new Date('2025-10-01')),
    amount: 4200 },
  {
    month: formatDate(new Date('2025-06-01')),
    amount: 2800 },
  {
    month: formatDate(new Date('2025-07-01')),
    amount: 3500 },
  {
    month: formatDate(new Date('2025-08-01')),
    amount: 3800 },
  {
    month: formatDate(new Date('2025-09-01')),
    amount: 2000 },
  {
    month: formatDate(new Date('2025-10-01')),
    amount: 4200 },
  {
    month: formatDate(new Date('2025-07-01')),
    amount: 3500 },
  {
    month: formatDate(new Date('2025-08-01')),
    amount: 3800 },
  {
    month: formatDate(new Date('2025-09-01')),
    amount: 2000 },
  {
    month: formatDate(new Date('2025-10-01')),
    amount: 4200 },
  {
    month: formatDate(new Date('2025-11-01')),
    amount: 2200 },
  {
    month: formatDate(new Date('2025-12-01')),
    amount: 1800 }
])

const categories: Record<string, BulletLegendItemInterface> = {
  amount: { name: 'Monthly Spending', color: '#22c55e' }
}

const formatCurrency = (tick: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(tick)
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})

function formatDate(dateString: Date) {
  const options = {
    month: 'short'
  }

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', options).format(date)
}
</script>

<template>
  <UCard class="bg-default!">
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold">
          Spending overview
        </h2><p class="text-muted">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
        </p>
      </div>

      <UCard variant="soft">
        <BarChart
          :data="chartData"
          :height="height"
          :categories="categories"
          x-axis="month"
          :y-axis="['amount']"
          :curve-type="CurveType.Basis"
          :legend-position="LegendPosition.TopRightCenter"
          :x-formatter="(i: number) => `${chartData[i]?.month}`"
          :radius="20"
          :x-num-ticks="4"
          :y-formatter="formatCurrency"
          class="dashed"
        />
      </UCard>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span class="text-muted">Mobile revenue</span>
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-arrow-right"
            trailing
            color="neutral"
            variant="ghost"
          >
            View Details
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style>
.dashed {
  --vis-axis-grid-line-dasharray: 5 5;
}
</style>
