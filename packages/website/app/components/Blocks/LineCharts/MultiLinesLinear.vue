<script lang="ts" setup>
import { useResponsiveHeight } from '~/composables/useResponsiveHeight'

defineOptions({
  tags: ['linecharts', 'multilineslinear']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

const chartData = [
  {
    date: 'Jan 23',
    subscriptions: 2890,
    downloads: 2338
  },
  {
    date: 'Feb 23',
    subscriptions: 2756,
    downloads: 2103
  },
  {
    date: 'Mar 23',
    subscriptions: 3322,
    downloads: 2194
  },
  {
    date: 'Apr 23',
    subscriptions: 3470,
    downloads: 2108
  },
  {
    date: 'May 23',
    subscriptions: 3475,
    downloads: 1812
  },
  {
    date: 'Jun 23',
    subscriptions: 3129,
    downloads: 1726
  },
  {
    date: 'Jul 23',
    subscriptions: 3490,
    downloads: 1982
  },
  {
    date: 'Aug 23',
    subscriptions: 2903,
    downloads: 2012
  },
  {
    date: 'Sep 23',
    subscriptions: 2643,
    downloads: 2342
  },
  {
    date: 'Oct 23',
    subscriptions: 2837,
    downloads: 2473
  },
  {
    date: 'Nov 23',
    subscriptions: 2954,
    downloads: 3848
  },
  {
    date: 'Dec 23',
    subscriptions: 3239,
    downloads: 3736
  }
]

const categories: Record<string, BulletLegendItemInterface> = {
  subscriptions: { name: 'Subscriptions', color: '#3b82f6' },
  downloads: { name: 'Downloads', color: '#22c55e' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return String(chartData[tick]?.date ?? '')
}

const { height } = useResponsiveHeight({
  default: 180,
  sm: 220,
  md: 260,
  lg: 300,
  xl: 340
})
</script>

<template>
  <div
    class="mx-auto max-w-3xl space-y-6 rounded-lg"
    :class="showTitle ? 'p-6' : ''"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Line Chart
      </h3>
      <NuxtLink to="/blocks/line-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <LineChart
      :data="chartData"
      :height="height"
      y-label="Sales"
      :x-num-ticks="4"
      :y-num-ticks="4"
      :categories="categories"
      :x-formatter="xFormatter"
      :y-grid-line="true"
      :curve-type="CurveType.Linear"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>
