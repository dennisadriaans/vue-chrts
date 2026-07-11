<script lang="ts" setup>
defineOptions({
  tags: ['blocks', 'combo-charts', 'traffic-conversion']
})

interface ChartItem {
  week: string
  visitors: number
  conversion: number
}

const data: ChartItem[] = [
  { week: 'W1', visitors: 1200, conversion: 2.1 },
  { week: 'W2', visitors: 1600, conversion: 2.6 },
  { week: 'W3', visitors: 1400, conversion: 2.3 },
  { week: 'W4', visitors: 2100, conversion: 3.4 },
  { week: 'W5', visitors: 1900, conversion: 3.1 },
  { week: 'W6', visitors: 2500, conversion: 4.0 }
]

const barCategories: Record<string, BulletLegendItemInterface> = {
  visitors: { name: 'Visitors', color: '#38bdf8' }
}

const lineCategories: Record<string, BulletLegendItemInterface> = {
  conversion: { name: 'Conversion %', color: '#f59e0b' }
}

const xFormatter = (tick: number) => data[tick]?.week ?? ''
</script>

<template>
  <UCard class="w-full">
    <div class="mb-4 space-y-1">
      <h3 class="text-highlighted font-semibold">
        Traffic & Conversion
      </h3>
      <p class="text-muted text-sm">
        Weekly visitors with conversion rate overlaid.
      </p>
    </div>
    <DualChart
      :data="data"
      :height="300"
      :bar-categories="barCategories"
      :line-categories="lineCategories"
      :bar-y-axis="['visitors']"
      :line-y-axis="['conversion']"
      :x-formatter="xFormatter"
      :y-grid-line="true"
      :legend-position="LegendPosition.TopRight"
    />
  </UCard>
</template>
