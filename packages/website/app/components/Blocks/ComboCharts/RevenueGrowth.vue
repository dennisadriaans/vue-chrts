<script lang="ts" setup>
defineOptions({
  tags: ['blocks', 'combo-charts', 'revenue-growth']
})

interface ChartItem {
  month: string
  revenue: number
  growth: number
}

const data: ChartItem[] = [
  { month: 'Jan', revenue: 420, growth: 120 },
  { month: 'Feb', revenue: 480, growth: 250 },
  { month: 'Mar', revenue: 510, growth: 380 },
  { month: 'Apr', revenue: 490, growth: 440 },
  { month: 'May', revenue: 550, growth: 520 },
  { month: 'Jun', revenue: 600, growth: 650 },
  { month: 'Jul', revenue: 640, growth: 710 },
  { month: 'Aug', revenue: 700, growth: 820 }
]

const barCategories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: 'Revenue', color: '#22c55e' }
}

const lineCategories: Record<string, BulletLegendItemInterface> = {
  growth: { name: 'Growth %', color: '#6366f1' }
}

const xFormatter = (tick: number) => data[tick]?.month ?? ''
</script>

<template>
  <UCard class="w-full">
    <div class="mb-4 space-y-1">
      <h3 class="text-highlighted font-semibold">
        Revenue & Growth
      </h3>
      <p class="text-muted text-sm">
        Monthly revenue against growth rate on a secondary axis.
      </p>
    </div>
    <DualChart
      :data="data"
      :height="300"
      :bar-categories="barCategories"
      :line-categories="lineCategories"
      :bar-y-axis="['revenue']"
      :line-y-axis="['growth']"
      :x-formatter="xFormatter"
      :y-grid-line="true"
      :legend-position="LegendPosition.TopRight"
    />
  </UCard>
</template>
