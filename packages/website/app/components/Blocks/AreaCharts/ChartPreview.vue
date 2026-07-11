<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'chartpreview']
})

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})

const colorMode = useColorMode()
interface AreaChartItem {
  month: string
  desktop: number
  mobile: number
}

const categories: ComputedRef<Record<string, BulletLegendItemInterface>>
  = computed(() => ({
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
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 190, mobile: 78 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]

const totals = computed(() => {
  return AreaChartData.reduce((acc, item) => {
    acc.desktop += item.desktop
    acc.mobile += item.mobile
    return acc
  }, { desktop: 0, mobile: 0 })
})

const total = computed(() => {
  const sum = totals.value.desktop + totals.value.mobile
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(sum)
})

const xFormatter = (tick: number): string => {
  return `${AreaChartData[tick]?.month.slice(0, 3)}`
}
</script>

<template>
  <UCard
    variant="subtle"
    class="border-2 border-default"
  >
    <div class="space-y-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <p class="text-muted">
            Total Revenue
          </p>
          <UIcon
            name="i-hugeicons-information-circle"
            class="text-dimmed"
          />
        </div>
        <div class="flex items-center gap-4">
          <h2 class="text-3xl font-semibold tracking-tight">
            {{ total }}
          </h2>
          <div class="flex items-center gap-1 text-success">
            <UBadge variant="soft">
              +21%
            </UBadge>
          </div>
        </div>
      </div>

      <UCard
        variant="soft"
      >
        <AreaChart
          :key="colorMode.value"
          class="dashed"
          :data="AreaChartData"
          :height="height"
          :categories="categories"
          :x-grid-line="true"
          :x-formatter="xFormatter"
          :x-num-ticks="6"
          :y-num-ticks="4"
          :curve-type="CurveType.MonotoneX"
          :hide-legend="true"
        />
      </UCard>

      <div class="flex items-center justify-between -mb-2">
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <span
              :style="`background-color: ${categories?.mobile!.color}`"
              class="h-2 w-2 animate-pulse rounded-full"
            />
            <span class="text-muted dark:text-dimmed">Mobile revenue:</span>
            <span class="font-medium">{{ totals.mobile }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              :style="`background-color: ${categories?.desktop?.color}`"
              class="h-2 w-2 animate-pulse rounded-full"
            />
            <span class="text-muted dark:text-dimmed">Desktop revenue:</span>
            <span class="font-medium">{{ totals.desktop }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-arrow-right"
            trailing
            color="neutral"
            variant="ghost"
          >
            View Details
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style>
.dashed {
  --vis-axis-grid-line-dasharray: 5 5;
}
</style>
