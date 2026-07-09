<script lang="ts" setup>
defineOptions({
  tags: ['zoomableareacharts', 'basic']
})

interface Point {
  date: string
  visitors: number
  signups: number
}

// ~120 days of synthetic traffic — enough points to make zoom/pan useful.
const data: Point[] = Array.from({ length: 120 }, (_, i) => {
  const base = 400 + Math.round(160 * Math.sin(i / 9))
  const noise = Math.round(80 * Math.sin(i / 2.3))
  const d = new Date(2024, 0, 1 + i)
  return {
    date: d.toISOString().slice(0, 10),
    visitors: Math.max(80, base + noise),
    signups: Math.max(20, Math.round((base + noise) * 0.28))
  }
})

const categories: Record<string, BulletLegendItemInterface> = {
  visitors: { name: 'Visitors', color: 'var(--color-blue-400)' },
  signups: { name: 'Signups', color: 'var(--color-green-400)' }
}
</script>

<template>
  <ZoomableAreaChart
    :data="data"
    :categories="categories"
    :height="320"
    x-key="date"
    :curve-type="CurveType.MonotoneX"
    :y-num-ticks="5"
  />
</template>
