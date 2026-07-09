<script setup lang="ts">
interface SpendingData {
  month: string
  amount: number
}

const chartData = ref<SpendingData[]>([
  // 2025 Data
  { month: formatDate(new Date('2025-01-01')), amount: 2500 },
  { month: formatDate(new Date('2025-02-01')), amount: 1500 },
  { month: formatDate(new Date('2025-03-01')), amount: 3000 },
  { month: formatDate(new Date('2025-04-01')), amount: 4000 },
  { month: formatDate(new Date('2025-05-01')), amount: 4500 },
  { month: formatDate(new Date('2025-06-01')), amount: 2800 },
  { month: formatDate(new Date('2025-07-01')), amount: 3500 },
  { month: formatDate(new Date('2025-08-01')), amount: 3800 },
  { month: formatDate(new Date('2025-09-01')), amount: 2000 },
  { month: formatDate(new Date('2025-10-01')), amount: 4200 },
  { month: formatDate(new Date('2025-11-01')), amount: 2200 },
  { month: formatDate(new Date('2025-12-01')), amount: 1800 },

  // 2026 Data (First 6 Months)
  { month: formatDate(new Date('2026-01-01')), amount: 2700 },
  { month: formatDate(new Date('2026-02-01')), amount: 1600 },
  { month: formatDate(new Date('2026-03-01')), amount: 3100 },
  { month: formatDate(new Date('2026-04-01')), amount: 4200 },
  { month: formatDate(new Date('2026-05-01')), amount: 4600 },
  { month: formatDate(new Date('2026-06-01')), amount: 2900 }
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
  default: 160,
  lg: 240
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
  <BarChart
    :data="chartData"
    :height="height"
    :categories="categories"
    x-axis="month"
    :y-axis="['amount']"
    :curve-type="CurveType.Basis"
    :legend-position="LegendPosition.TopRightCenter"
    :hide-legend="true"
    :x-formatter="(i: number) => `${chartData[i]?.month}`"
    :radius="20"
    :x-num-ticks="4"
    :y-formatter="formatCurrency"
    class="space-y-0! dashed"
  />
</template>
