<script lang="ts" setup>
defineOptions({
  tags: ['radialbarcharts', 'basic']
})

// RadialBarChart takes a positional number[] aligned with `categories`.
const radialBarData = [1200, 940, 720, 410]

const categories: Record<string, BulletLegendItemInterface> = {
  chrome: { name: 'Chrome', color: 'var(--color-blue-400)' },
  safari: { name: 'Safari', color: 'var(--color-green-400)' },
  firefox: { name: 'Firefox', color: 'var(--color-orange-400)' },
  edge: { name: 'Edge', color: 'var(--color-purple-400)' }
}
</script>

<template>
  <RadialBarChart
    :data="radialBarData"
    :categories="categories"
    :height="320"
    :corner-radius="4"
    :legend-position="LegendPosition.BottomCenter"
  />
</template>
