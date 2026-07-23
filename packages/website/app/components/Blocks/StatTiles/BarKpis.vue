<script lang="ts" setup>
import StatTile from '~/components/lib/StatTile/StatTile.vue'

defineOptions({
  tags: ['blocks', 'stat-tiles', 'bar-kpis']
})

const tiles = [
  { label: 'Deploys', value: '312', icon: 'i-lucide-rocket', trend: { value: '+9', direction: 'up' as const }, caption: 'this week', sparkline: [4, 6, 5, 8, 7, 9, 8, 11], sparklineType: 'bar' as const, color: 'var(--ui-primary)' },
  { label: 'Failed jobs', value: '7', icon: 'i-lucide-triangle-alert', trend: { value: '-3', direction: 'down' as const }, caption: 'this week', sparkline: [5, 4, 6, 3, 4, 2, 3, 1], sparklineType: 'bar' as const, color: 'var(--ui-error)' },
  { label: 'Uptime', value: '99.98', suffix: '%', icon: 'i-lucide-activity', trend: { value: '+0.02%', direction: 'up' as const }, caption: '30-day', sparkline: [99, 100, 99, 100, 100, 99, 100, 100], sparklineType: 'bar' as const, color: 'var(--ui-success)' }
]
</script>

<template>
  <div class="grid w-full gap-4 sm:grid-cols-3">
    <StatTile
      v-for="tile in tiles"
      :key="tile.label"
      v-bind="tile"
    />
  </div>
</template>
