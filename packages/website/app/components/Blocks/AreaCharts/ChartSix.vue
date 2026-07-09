<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'chartsix']
})

const colorMode = useColorMode()

interface AreaChartItem {
  date: string
  desktop: number
  mobile: number
}

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  desktop: {
    name: 'Desktop',
    color: '#3b82f6'
  },
  mobile: {
    name: 'Mobile',
    color: '#22c55e'
  }
}))

const AreaChartData: AreaChartItem[] = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-02', desktop: 180, mobile: 97 },
  { date: '2024-04-03', desktop: 167, mobile: 120 },
  { date: '2024-04-04', desktop: 260, mobile: 240 },
  { date: '2024-04-05', desktop: 240, mobile: 290 }
]

const xFormatter = (i: number): string | number => `${AreaChartData[i]?.date}`

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
            Traffic by Device
          </h3>
          <p class="text-muted text-sm">
            Compare desktop and mobile visits over time
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
          :key="colorMode.value"
          :data="AreaChartData"
          :height="height"
          :categories="categories"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
        />
      </UCard>
    </div>
  </UCard>
</template>
