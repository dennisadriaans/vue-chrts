<script setup lang="ts">
defineOptions({
  tags: ['linecharts', 'chartseven']
})

const colorMode = useColorMode()

interface AppData {
  date: string
  subscriptions: number
  downloads: number
}

const chartData = ref<AppData[]>([
  { date: 'Jan 23', subscriptions: 2890, downloads: 2338 },
  { date: 'Feb 23', subscriptions: 2756, downloads: 2103 },
  { date: 'Mar 23', subscriptions: 3322, downloads: 2194 },
  { date: 'Apr 23', subscriptions: 3470, downloads: 2108 },
  { date: 'May 23', subscriptions: 3475, downloads: 1812 },
  { date: 'Jun 23', subscriptions: 3129, downloads: 1726 },
  { date: 'Jul 23', subscriptions: 3490, downloads: 1982 },
  { date: 'Aug 23', subscriptions: 2903, downloads: 2012 },
  { date: 'Sep 23', subscriptions: 2643, downloads: 2342 },
  { date: 'Oct 23', subscriptions: 2837, downloads: 2473 },
  { date: 'Nov 23', subscriptions: 2954, downloads: 3848 },
  { date: 'Dec 23', subscriptions: 3239, downloads: 3736 }
])

const chartCategories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  subscriptions: {
    name: 'Subscriptions',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  downloads: {
    name: 'Downloads',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  }
}))

const xAxisFormatter = (tick: number): string => {
  return chartData.value[tick]?.date || ''
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
          App Statistics
        </h2>
        <p class="text-muted text-sm">
          Tracking monthly subscriptions and downloads growth.
        </p>
      </div>

      <UCard>
        <LineChart
          :data="chartData"
          :height="height"
          :categories="chartCategories"
          :x-formatter="xAxisFormatter"
          :curve-type="CurveType.Linear"
          :legend-position="LegendPosition.TopRight"
          :x-grid-line="true"
          :y-grid-line="true"
          :y-num-ticks="4"
          :x-num-ticks="4"
        />
      </UCard>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span class="text-muted text-sm">Live Updates</span>
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-share-2"
            size="sm"
            variant="ghost"
            color="neutral"
          />
          <UButton
            icon="i-lucide-download"
            size="sm"
            variant="ghost"
            color="neutral"
          >
            Export
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
