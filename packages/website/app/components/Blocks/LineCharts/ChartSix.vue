<script setup lang="ts">
defineOptions({
  tags: ['linecharts', 'chartsix']
})

const colorMode = useColorMode()

// Make ChartSix a unique multi-series variant by mixing features from Markers & DashArray
type ChartDataItem = {
  month: string
  desktop: number
  mobile: number
}

const chartData = ref<ChartDataItem[]>([
  { month: 'January', desktop: 186, mobile: 156 },
  { month: 'February', desktop: 305, mobile: 225 },
  { month: 'March', desktop: 237, mobile: 210 },
  { month: 'April', desktop: 260, mobile: 209 },
  { month: 'May', desktop: 209, mobile: 190 },
  { month: 'June', desktop: 250, mobile: 214 }
])

const chartCategories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  desktop: {
    name: 'Desktop',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  mobile: {
    name: 'Mobile',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  }
}))

const xAxisFormatter = (tick: number): string => {
  return chartData.value[tick]?.month || ''
}

const yAxisFormatter = (v: number): string => `${v} visits`

const markerConfig = computed(() => {
  const desktopColor = chartCategories.value.desktop?.color
  const mobileColor = chartCategories.value.mobile?.color

  return {
    id: 'marker-config',
    config: {
      desktop: {
        type: 'circle' as const,
        size: 7,
        color: Array.isArray(desktopColor) ? desktopColor[0] : (desktopColor ?? ''),
        strokeColor: Array.isArray(desktopColor) ? desktopColor[0] : (desktopColor ?? ''),
        strokeWidth: 2
      },
      mobile: {
        type: 'diamond' as const,
        size: 8,
        color: Array.isArray(mobileColor) ? mobileColor[0] : (mobileColor ?? ''),
        strokeColor: Array.isArray(mobileColor) ? mobileColor[0] : (mobileColor ?? ''),
        strokeWidth: 2
      }
    }
  }
})

const lineDashArray: number[][] = [
  [0, 0],
  [6, 3]
]

const { height } = useResponsiveHeight({
  default: 140,
  sm: 260
})
</script>

<template>
  <UCard>
    <div class="space-y-6">
      <div>
        <h3 class="text-lg font-medium">
          Traffic Split
        </h3>
        <p class="text-muted text-sm">
          Desktop vs Mobile over time
        </p>
      </div>

      <UCard>
        <LineChart
          :data="chartData"
          :height="height"
          :categories="chartCategories"
          :x-formatter="xAxisFormatter"
          :y-formatter="yAxisFormatter"
          :y-grid-line="true"
          :x-grid-line="true"
          :x-domain-line="true"
          :y-domain-line="true"
          :x-tick-line="true"
          :y-tick-line="true"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.BottomRight"
          :marker-config="markerConfig"
          :line-dash-array="lineDashArray"
        >
          <template #tooltip="{ values }">
            <div class="bg-elevated min-w-36 rounded-md p-2 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-800">
              <div class="mb-1 text-xs text-muted">
                {{ values?.month }}
              </div>
              <div class="flex items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span
                    class="h-2 w-2 rounded-full"
                    :style="{ background: Array.isArray(chartCategories.desktop?.color) ? chartCategories.desktop.color[0] : (chartCategories.desktop?.color ?? '') }"
                  />
                  <span class="text-default">Desktop</span>
                </div>
                <span class="font-medium text-default">{{ values?.desktop }}</span>
              </div>
              <div class="mt-1 flex items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span
                    class="h-2 w-2 rounded-full"
                    :style="{ background: Array.isArray(chartCategories.mobile?.color) ? chartCategories.mobile.color[0] : (chartCategories.mobile?.color ?? '') }"
                  />
                  <span class="text-default">Mobile</span>
                </div>
                <span class="font-medium text-default">{{ values?.mobile }}</span>
              </div>
            </div>
          </template>
        </LineChart>
      </UCard>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span class="text-muted text-sm">Real-time Analytics</span>
        </div>
        <UButton
          size="sm"
          variant="ghost"
          color="neutral"
          icon="i-lucide-external-link"
        >
          View Details
        </UButton>
      </div>
    </div>
  </UCard>
</template>
