<script lang="ts" setup>
import { useResponsiveHeight } from '~/composables/useResponsiveHeight'

defineOptions({
  tags: ['areacharts', 'basic']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

interface AreaChartItem {
  month: string
  desktop: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#3b82f6' }
}

const AreaChartData: AreaChartItem[] = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 }
]

const xFormatter = (tick: number, i?: number, ticks?: number[]): string => {
  if (typeof tick === 'number' && AreaChartData[tick]?.month) {
    return AreaChartData[tick].month
  }
  return String(tick)
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
      y-label="Value"
      x-label="Month"
      :categories="categories"
      :y-num-ticks="4"
      :x-num-ticks="7"
      :y-grid-line="true"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :marker-config="{
        desktop: {
          type: 'circle',
          size: 6,
          strokeWidth: 2,
          color: '#3b82f6'
        }
      }"
      :x-formatter="xFormatter"
    />
  </div>
</template>

<style scoped>
/* Stroke maps to color key in categories */
/* The color should match the color defined in categories */
.markers:deep(*[stroke='#3b82f6']) {
  marker: url('#circle-marker-desktop');
}
</style>
