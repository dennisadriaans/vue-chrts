<script lang="ts" setup>
defineOptions({
  tags: ['dualchart', 'basic']
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
  { month: 'Jun', revenue: 600, growth: 650 }
]

const barCategories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: 'Revenue', color: '#3b82f6' }
}

const lineCategories: Record<string, BulletLegendItemInterface> = {
  growth: { name: 'Growth %', color: '#22c55e' }
}

const xFormatter = (tick: number) => data[tick]?.month ?? ''
</script>

<template>
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
</template>
