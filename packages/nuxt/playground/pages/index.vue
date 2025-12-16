<script setup lang="ts">
interface SpendingData {
  month: number
  amount: number
}

const chartData = ref<SpendingData[]>([
  { month: 1, amount: 2500 },
  { month: 2, amount: 1500 },
  { month: 3, amount: 3000 },
  { month: 4, amount: 4000 },
  { month: 5, amount: 4500 },
  { month: 6, amount: 2800 },
  { month: 7, amount: 3500 },
  { month: 8, amount: 3800 },
  { month: 9, amount: 2000 },
  { month: 10, amount: 4200 },
  { month: 11, amount: 2200 },
  { month: 12, amount: 1800 },
])

const categories: Record<string, BulletLegendItemInterface> = {
  amount: { name: 'Monthly Spending', color: '#22c55e' },
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
 
      <AreaChart
        :data="chartData"
        :height="300"
        :categories="categories"
        :y-axis="['amount']"
        :y-num-ticks="2"
        :y-grid-line="true"
        :legend-position="LegendPosition.Bottom"
        :x-formatter="
          (i) =>
            new Date(`2025-${chartData[i]?.month}-02`).toLocaleDateString(
              'en-US',
              {
                month: 'short',
              },
            )
        "
        :y-formatter="formatCurrency"
      />
</template>
