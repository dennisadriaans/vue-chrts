<script lang="ts" setup>
import type { MarkerConfig } from '~/types/types'

defineOptions({
  tags: ['linecharts', 'markers']
})

const chartData = [
  { month: 'January', desktop: 120 },
  { month: 'February', desktop: 185 },
  { month: 'March', desktop: 160 },
  { month: 'April', desktop: 220 },
  { month: 'May', desktop: 195 },
  { month: 'June', desktop: 270 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#22c55e' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return chartData[tick]?.month ?? ''
}

const markerConfig: MarkerConfig = {
  id: 'main-chart',
  config: {
    desktop: {
      type: 'circle',
      size: 16,
      color: '#22c55e',
      strokeColor: '#22c55e',
      strokeWidth: 2
    }
  }
}
</script>

<template>
  <LineChart
    :data="chartData"
    :height="300"
    x-label="Time"
    y-label="Temperature"
    :categories="categories"
    :y-num-ticks="4"
    :x-num-ticks="7"
    :x-formatter="xFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :y-grid-line="true"
    :marker-config="markerConfig"
    @click="(e, data) => console.log('Chart clicked', data)"
  />
</template>

<style scoped>
/* Stroke maps to color key in categories */
/* The color should match the color defined in categories */
#main-chart:deep(*[stroke='#22c55e']) {
  marker: url('#main-chart-desktop');
}
</style>
