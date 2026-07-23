<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'chartone']
})

interface ClimateData {
  month: string
  Temperature: number
  Precipitation: number
}

const chartData = ref<ClimateData[]>([
  { month: 'Jan', Temperature: 4, Precipitation: 85 },
  { month: 'Feb', Temperature: 6, Precipitation: 70 },
  { month: 'Mar', Temperature: 11, Precipitation: 65 },
  { month: 'Apr', Temperature: 16, Precipitation: 55 },
  { month: 'May', Temperature: 21, Precipitation: 40 }, // Entering dry season
  { month: 'Jun', Temperature: 26, Precipitation: 20 }, // Peak heat
  { month: 'Jul', Temperature: 29, Precipitation: 15 } // Arid peak
])

const chartCategories: Record<string, BulletLegendItemInterface> = {
  Temperature: {
    name: 'Avg Temp (°C)',
    color: '#ef4444' // Warm Red
  },
  Precipitation: {
    name: 'Rainfall (mm)',
    color: '#3b82f6' // Blue
  }
}

const xAxisFormatter = (tick: number): string => {
  const months = chartData.value.map(item => item.month)
  return months[tick] || ''
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard>
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-medium">
          Climate Trends
        </h2>
        <p class="text-muted text-sm">
          Monthly comparison of average surface temperature and cumulative rainfall.
        </p>
      </div>

      <UCard>
        <LineChart
          :data="chartData"
          :categories="chartCategories"
          :y-axis="['Temperature', 'Precipitation']"
          :x-formatter="xAxisFormatter"
          :height="height"
          :stacked="false"
          :radius="3"
          :group-padding="0.2"
          :bar-padding="0.2"
          :x-grid-line="true"
          :y-grid-line="true"
          :y-num-ticks="4"
          :legend-position="LegendPosition.TopRight"
        />
      </UCard>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-blue-500 h-2 w-2 animate-pulse rounded-full" />
          <span class="text-muted">Live Sensor Data</span>
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-thermometer"
            trailing
            color="neutral"
            variant="ghost"
          >
            Regional Reports
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
