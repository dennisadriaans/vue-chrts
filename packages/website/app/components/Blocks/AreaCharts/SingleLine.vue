<script lang="ts" setup>
import { useResponsiveHeight } from '~/composables/useResponsiveHeight'

defineOptions({
  tags: ['areacharts', 'singleline']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

const categories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: 'Revenue', color: '#22c55e' }
}

interface AreaChartItem {
  date: string
  revenue: number
}

const AreaChartData: AreaChartItem[] = [
  { date: 'Jan 23', revenue: 2340 },
  { date: 'Feb 23', revenue: 2550 },
  { date: 'Mar 23', revenue: 2730 },
  { date: 'Apr 23', revenue: 2950 },
  { date: 'May 23', revenue: 3120 },
  { date: 'Jun 23', revenue: 3300 },
  { date: 'Jul 23', revenue: 3500 },
  { date: 'Aug 23', revenue: 3700 },
  { date: 'Sep 23', revenue: 3900 },
  { date: 'Oct 23', revenue: 3800 },
  { date: 'Nov 23', revenue: 3300 },
  { date: 'Dec 23', revenue: 2000 }
]

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return `${AreaChartData[tick]?.date ?? ''}`
}

const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})
</script>

<template>
  <div
    class="mx-auto max-w-3xl space-y-6 rounded-lg"
    :class="showTitle ? 'p-6' : ''"
  >
    <div
      v-if="showTitle"
      class="flex items-center justify-between"
    >
      <h3 class="text-lg font-semibold">
        Area Chart
      </h3>
      <NuxtLink to="/blocks/area-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <AreaChart
      :data="AreaChartData"
      :height="height"
      y-label="Revenue"
      x-label="Month"
      :categories="categories"
      :y-num-ticks="4"
      :x-num-ticks="7"
      :y-grid-line="true"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :x-formatter="xFormatter"
    />
  </div>
</template>
