<script lang="ts" setup>
defineOptions({
  tags: ['funnelcharts', 'basic']
})

// FunnelChart takes a positional number[] aligned with `categories`.
// Largest first reads top-to-bottom.
const funnelData = [5000, 2300, 1200, 480]

const categories: Record<string, BulletLegendItemInterface> = {
  visits: { name: 'Visits', color: 'var(--color-blue-400)' },
  signups: { name: 'Signups', color: 'var(--color-pink-400)' },
  trials: { name: 'Trials', color: 'var(--color-orange-400)' },
  paid: { name: 'Paid', color: 'var(--color-green-400)' }
}
</script>

<template>
  <FunnelChart
    :data="funnelData"
    :categories="categories"
    :height="320"
    :legend-position="LegendPosition.BottomCenter"
  />
</template>
