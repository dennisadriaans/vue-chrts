<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'charteight']
})

interface AreaChartItem {
  month: string
  desktop: number
}

const AreaChartData: AreaChartItem[] = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 }
]
const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#3b82f6' }
}

const xFormatter = (i: number): string | number => `${AreaChartData[i]?.month}`

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold">
            Desktop Performance
          </h3>
          <p class="text-muted text-sm">
            Monthly desktop scores at a glance
          </p>
        </div>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            icon="i-hugeicons:sparkles"
            variant="ghost"
            color="neutral"
          />
        </NuxtLink>
      </div>

      <UCard variant="soft">
        <AreaChart
          :data="AreaChartData"
          :height="height"
          x-label="Month"
          y-label="Score"
          :categories="categories"
          :y-num-ticks="4"
          :x-num-ticks="7"
          :y-grid-line="true"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
          :x-formatter="xFormatter"
          :curve-type="CurveType.Step"
        />
        <div class="text-dimmed mt-6 text-center text-xs">
          <span>Tip: Toggle the legend to highlight desktop data.</span>
        </div>
      </UCard>
    </div>
  </UCard>
</template>
