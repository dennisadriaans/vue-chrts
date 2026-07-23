<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'basictooltip']
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

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  if (typeof tick === 'number' && AreaChartData[tick]?.month) {
    return AreaChartData[tick].month
  }
  return String(tick)
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function getFullMonthName(month: string): string {
  return month || ''
}
</script>

<template>
  <AreaChart
    class="w-full"
    :data="AreaChartData"
    :height="320"
    y-label="Value"
    x-label="Month"
    :categories="categories"
    :y-num-ticks="4"
    :x-num-ticks="7"
    :y-grid-line="true"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :x-formatter="xFormatter"
  >
    <template #tooltip="{ values }">
      <div
        class="flex max-w-64 items-center justify-center gap-2 p-2"
      >
        <LibProgressCircle
          :value="100"
          :size="100"
          :stroke-width="6"
        />

        <div>
          <div class="text-default text-normal">
            {{ getFullMonthName(values?.month ?? '') }}
          </div>
          <p class="text-sm text-muted">
            In this month your spent
            {{ formatCurrency(values?.desktop ?? 0) }} in total.
          </p>
          <a
            href="/"
            class="text-primary text-sm"
          >Learn more</a>
        </div>
      </div>
    </template>
  </AreaChart>
</template>
