<script lang="ts" setup>
import StatTile from '~/components/lib/StatTile/StatTile.vue'

defineOptions({
  tags: ['blocks', 'stat-tiles', 'kpi-row']
})

const tiles = [
  { label: 'Monthly revenue', value: '84,120', prefix: '$', icon: 'i-lucide-dollar-sign', trend: { value: '+12.5%', direction: 'up' as const }, caption: 'vs. last month', sparkline: [42, 48, 45, 52, 49, 58, 56, 64, 61, 70, 76, 84] },
  { label: 'Active users', value: '12,480', icon: 'i-lucide-users', trend: { value: '+4.1%', direction: 'up' as const }, caption: 'vs. last week', sparkline: [30, 31, 29, 33, 34, 32, 36, 38, 37, 40, 42, 44] },
  { label: 'Churn rate', value: '2.4', suffix: '%', icon: 'i-lucide-trending-down', trend: { value: '-0.6%', direction: 'down' as const }, caption: 'vs. last month', sparkline: [4.1, 3.9, 3.6, 3.4, 3.5, 3.1, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4] },
  { label: 'Avg. order value', value: '68.40', prefix: '$', icon: 'i-lucide-shopping-cart', trend: { value: '+2.3%', direction: 'up' as const }, caption: 'vs. last month', sparkline: [60, 61, 63, 62, 64, 65, 64, 66, 67, 66, 68, 68] }
]
</script>

<template>
  <div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatTile
      v-for="tile in tiles"
      :key="tile.label"
      v-bind="tile"
    />
  </div>
</template>
