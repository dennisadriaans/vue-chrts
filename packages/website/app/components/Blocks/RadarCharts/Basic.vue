<script lang="ts" setup>
defineOptions({
  tags: ['radarcharts', 'basic']
})

interface RadarDatum {
  metric: string
  productA: number
  productB: number
}

const radarChartData: RadarDatum[] = [
  { metric: 'Performance', productA: 90, productB: 72 },
  { metric: 'Reliability', productA: 78, productB: 85 },
  { metric: 'Comfort', productA: 66, productB: 80 },
  { metric: 'Safety', productA: 88, productB: 74 },
  { metric: 'Efficiency', productA: 70, productB: 90 },
  { metric: 'Design', productA: 82, productB: 68 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  productA: { name: 'Product A', color: 'var(--color-blue-400)' },
  productB: { name: 'Product B', color: 'var(--color-pink-400)' }
}
</script>

<template>
  <RadarChart
    :data="radarChartData"
    :categories="categories"
    data-key="metric"
    :height="320"
    :fill-opacity="0.35"
    :legend-position="LegendPosition.BottomCenter"
  />
</template>
