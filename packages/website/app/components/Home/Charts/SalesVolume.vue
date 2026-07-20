<script setup lang="ts">
interface SalesVolumeDataItem {
  month: string
  volume: number
}

const chartData: SalesVolumeDataItem[] = [
  { month: 'Jan', volume: 18000 },
  { month: 'Jan', volume: 34000 },
  { month: 'Feb', volume: 28000 },
  { month: 'Feb', volume: 42000 },
  { month: 'Mar', volume: 42000 },
  { month: 'Mar', volume: 52000 },
  { month: 'Apr', volume: 76000 },
  { month: 'Apr', volume: 45000 },
  { month: 'May', volume: 56000 },
  { month: 'May', volume: 98000 },
  { month: 'Jun', volume: 77000 },
  { month: 'Jun', volume: 68000 },
  { month: 'Jul', volume: 108000 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  volume: {
    name: 'Sales volume',
    color: 'var(--ui-primary)'
  }
}

const monthTicks: Record<number, string> = {
  0: 'Jan',
  2: 'Feb',
  4: 'Mar',
  6: 'Apr',
  8: 'May',
  10: 'Jun',
  12: 'Jul'
}

const xFormatter = (tick: number): string => monthTicks[tick] ?? ''

const yFormatter = (value: number): string => {
  if (value === 0) return ''
  return `${(value / 1000).toFixed(0)}K`
}
</script>

<template>
  <div class="space-y-3">
    <div>
      <p class="text-sm font-medium text-muted">
        Sales volume
      </p>
      <div class="flex items-center gap-2">
        <p class="text-2xl font-bold tracking-tight tabular-nums">
          $84,328
        </p>
        <UBadge
          color="neutral"
          variant="soft"
          class="rounded-full"
        >
          <template #leading>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-3.5 text-success"
            />
          </template>
          36.8%
        </UBadge>
      </div>
    </div>

    <LineChart
      :data="chartData"
      :height="160"
      :categories="categories"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :curve-type="CurveType.Linear"
      :hide-legend="true"
      :x-grid-line="false"
      :y-grid-line="true"
      :x-domain-line="false"
      :y-domain-line="false"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-num-ticks="7"
      :y-num-ticks="4"
      style="--vis-axis-grid-line-dasharray: 5 5"
    />
  </div>
</template>
