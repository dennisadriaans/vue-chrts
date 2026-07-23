<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'chartseven']
})

const categories: Record<string, BulletLegendItemInterface> = {
  deploys: { name: 'Deployments', color: '#06b6d4' },
  builds: { name: 'Builds', color: '#8b5cf6' },
  requests: { name: 'API Requests', color: '#3b82f6' }
}

interface AreaChartItem {
  date: string
  deploys: number
  builds: number
  requests: number
}

const AreaChartData: AreaChartItem[] = [
  { date: 'W1', deploys: 1200, builds: 2800, requests: 8500 },
  { date: 'W2', deploys: 1800, builds: 3200, requests: 11200 },
  { date: 'W3', deploys: 2100, builds: 3800, requests: 13400 },
  { date: 'W4', deploys: 2400, builds: 4100, requests: 14800 },
  { date: 'W5', deploys: 1950, builds: 3600, requests: 12100 },
  { date: 'W6', deploys: 2650, builds: 4500, requests: 16200 },
  { date: 'W7', deploys: 3100, builds: 5200, requests: 18900 },
  { date: 'W8', deploys: 2850, builds: 4800, requests: 17400 },
  { date: 'W9', deploys: 2400, builds: 4200, requests: 15200 },
  { date: 'W10', deploys: 2200, builds: 3900, requests: 13800 },
  { date: 'W11', deploys: 2550, builds: 4300, requests: 15600 },
  { date: 'W12', deploys: 3200, builds: 5500, requests: 19800 }
]

const xFormatter = (_tick: number, i?: number): string => {
  if (typeof i === 'number' && AreaChartData[i]) {
    return String(AreaChartData[i].date)
  }
  return ''
}

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
            Platform Activity
          </h3>
          <p class="text-muted mt-1 text-sm">
            Last 12 weeks · Production environment
          </p>
        </div>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            icon="i-hugeicons:edit-02"
            variant="ghost"
            color="neutral"
          />
        </NuxtLink>
      </div>

      <UCard variant="soft">
        <AreaChart
          :data="AreaChartData"
          :height="height"
          x-label="Week"
          y-label="Count"
          :categories="categories"
          :x-num-ticks="12"
          :x-formatter="xFormatter"
          :curve-type="CurveType.MonotoneX"
          :x-grid-line="false"
          :y-grid-line="true"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
          :show-tooltip="true"
        />
      </UCard>

      <div class="flex items-center justify-between">
        <p class="text-muted flex items-center gap-1.5 text-xs">
          <UIcon
            name="i-lucide-info"
            class="size-3"
          />
          <span>Click legend to toggle layers · Hover for details</span>
        </p>
        <UButton
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-chevron-right"
        >
          View Analytics
        </UButton>
      </div>
    </div>
  </UCard>
</template>
