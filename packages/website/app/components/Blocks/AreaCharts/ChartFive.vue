<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'chartfive']
})

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

const xFormatter = (_tick: number, i?: number): string => {
  return AreaChartData[i ?? 0]?.month ?? ''
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 260
})
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">
          Revenue
        </h3>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            trailing-icon="i-hugeicons:arrow-up-right-01"
            variant="ghost"
            label="Open Window"
            color="neutral"
          />
        </NuxtLink>
      </div>

      <UCard variant="soft">
        <AreaChart
          :data="AreaChartData"
          :height="height"
          y-label="Value"
          x-label="Month"
          :categories="categories"
          :y-num-ticks="4"
          :x-num-ticks="7"
          :x-grid-line="true"
          :y-grid-line="true"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
          :x-formatter="xFormatter"
        />
        <div class="text-dimmed mt-6 text-center text-xs">
          <span>Tip: Use the legend above to filter data series.</span>
        </div>
      </UCard>
    </div>
  </UCard>
</template>
