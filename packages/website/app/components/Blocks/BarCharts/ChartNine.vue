<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartnine']
})

type RevenueDataItem = {
  month: string
  desktop: number
  mobile: number
}

const revenueData: RevenueDataItem[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]
const revenueCategoriesMultiple = {
  desktop: { name: 'Desktop', color: 'var(--ui-primary)' },
  mobile: { name: 'Mobile', color: 'var(--ui-success)' }
}
const xFormatter = (i: number): string => `${revenueData[i]?.month}`
const yFormatter = (i: number): string => `${i}`

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-sm text-muted">
            This period
          </p>
          <p class="text-3xl font-semibold">
            21K
          </p>
          <p class="text-xs text-dimmed">
            1 Jan – Today
          </p>
        </div>

        <div class="text-right">
          <p class="text-sm text-muted">
            Previous period
          </p>
          <p class="text-3xl font-semibold">
            17K
          </p>
          <p class="text-xs text-dimmed">
            +21.6% vs prior
          </p>
        </div>
      </div>

      <UCard variant="soft">
        <BarChart
          :data="revenueData"
          :stacked="true"
          :height="height"
          :categories="revenueCategoriesMultiple"
          :y-axis="['desktop', 'mobile']"
          :group-padding="0"
          :bar-padding="0.2"
          :x-num-ticks="6"
          :y-num-ticks="3"
          :radius="4"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.TopRight"
          :x-grid-line="true"
          :y-grid-line="false"
        />
        <div class="mt-6 text-center text-xs text-dimmed">
          <span>Tip: Toggle legend items to focus on a device.</span>
        </div>
      </UCard>
    </div>
  </UCard>
</template>
