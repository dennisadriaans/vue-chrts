<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'chartten']
})

const colorMode = useColorMode()

interface AreaChartItem {
  day: string
  temperature: number
  humidity: number
  pressure: number
}

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  temperature: {
    name: 'Temperature (°C)',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  },
  humidity: {
    name: 'Humidity (%)',
    color: colorMode.value === 'dark' ? '#06b6d4' : '#0891b2'
  },
  pressure: {
    name: 'Pressure (hPa)',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  }
}))

const AreaChartData: AreaChartItem[] = [
  { day: 'Mon', temperature: 22, humidity: 65, pressure: 1013 },
  { day: 'Tue', temperature: 25, humidity: 70, pressure: 1015 },
  { day: 'Wed', temperature: 19, humidity: 80, pressure: 1008 },
  { day: 'Thu', temperature: 28, humidity: 55, pressure: 1020 },
  { day: 'Fri', temperature: 24, humidity: 62, pressure: 1012 },
  { day: 'Sat', temperature: 26, humidity: 58, pressure: 1018 },
  { day: 'Sun', temperature: 21, humidity: 75, pressure: 1010 }
]

const xFormatter = (i: number): string => `${AreaChartData[i]?.day}`

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
            Weather Metrics
          </h3>
          <p class="text-muted text-sm">
            Daily temperature, humidity, and pressure
          </p>
        </div>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            icon="i-hugeicons:ai-magic"
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
          :curve-type="CurveType.Cardinal"
          :x-formatter="xFormatter"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
        />
        <div class="text-dimmed mt-6 text-center text-xs">
          <span>Tip: Use the legend to focus on a specific metric.</span>
        </div>
      </UCard>
    </div>
  </UCard>
</template>
