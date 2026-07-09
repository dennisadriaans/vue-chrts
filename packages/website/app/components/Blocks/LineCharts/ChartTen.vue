<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'chartten']
})

const chartData = [
  { 'day': 'Mon', 'Current pace': 12, 'Expected pace': 18 },
  { 'day': 'Tue', 'Current pace': 46, 'Expected pace': 32 },
  { 'day': 'Wed', 'Current pace': 68, 'Expected pace': 45 },
  { 'day': 'Thu', 'Current pace': 80, 'Expected pace': 58 },
  { 'day': 'Fri', 'Current pace': 88, 'Expected pace': 70 },
  { 'day': 'Sat', 'Current pace': 96, 'Expected pace': 85 },
  { 'day': 'Sun', 'Current pace': undefined, 'Expected pace': 100 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  'Current pace': { name: 'Current pace', color: 'var(--ui-primary)' },
  'Expected pace': { name: 'Expected pace', color: 'var(--ui-border-accented)' }
}

const xFormatter = (tick: number): string => {
  return chartData[tick]?.day ?? ''
}

const yFormatter = (tick: number): string => {
  return `${tick}%`
}

const markerConfig: MarkerConfig = {
  id: 'milestone-chart',
  config: {
    'Current pace': {
      type: 'circle',
      size: 8,
      color: 'var(--ui-primary)',
      strokeColor: 'var(--ui-primary)',
      strokeWidth: 1
    }
  }
}

const lineDashArray = [[], [5, 5]]
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h3 class="text-default font-semibold">
          Milestone Execution
        </h3>
        <UBadge
          color="neutral"
          variant="soft"
        >
          Weekly
        </UBadge>
        <UBadge
          color="neutral"
          variant="soft"
        >
          v1.4
        </UBadge>
      </div>
      <div class="flex items-center gap-1.5 text-sm font-medium">
        <UIcon
          name="i-lucide-check-circle-2"
          class="size-4 text-primary"
        />
        <span class="text-primary">+2%</span>
      </div>
    </div>

    <div class="relative pt-4">
      <LineChart
        :data="chartData"
        :height="320"
        :categories="categories"
        :y-num-ticks="4"
        :x-num-ticks="7"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :legend-position="LegendPosition.BottomCenter"
        :hide-legend="false"
        :y-grid-line="true"
        :x-grid-line="false"
        :curve-type="CurveType.Natural"
        :marker-config="markerConfig"
        :line-dash-array="lineDashArray"
      />
    </div>
  </UCard>
</template>

<style scoped>
#milestone-chart:deep(*[stroke='var(--ui-primary)']) {
  marker: url('#milestone-chart-Current pace');
}

/* Specific styling to match the light grey dashed expected pace */
:deep(.vis-line-path[stroke='#cbd5e1']) {
  stroke-width: 1px !important;
}

:deep(.vis-line-path[stroke='var(--ui-primary)']) {
  stroke-width: 1px !important;
}
</style>
