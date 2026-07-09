<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'stacked']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

type RevenueDataItem = {
  month: string
  desktop: number
  mobile: number
}

const RevenueData: RevenueDataItem[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]
const RevenueCategoriesMultple = {
  desktop: { name: 'Desktop', color: '#3b82f6' },
  mobile: { name: 'Mobile', color: '#22c55e' }
}
const xFormatter = (i: number): string => `${RevenueData[i]?.month}`
const yFormatter = (tick: number, _i?: number, _ticks?: number[]) =>
  tick.toString()
</script>

<template>
  <div
    class="mx-auto max-w-3xl space-y-6 rounded-lg"
    :class="showTitle ? 'p-6' : ''"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Bar Chart
      </h3>
      <NuxtLink to="/blocks/bar-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <BarChart
      :data="RevenueData"
      :stacked="true"
      :height="300"
      :categories="RevenueCategoriesMultple"
      :y-axis="['desktop', 'mobile']"
      :group-padding="0"
      :bar-padding="0.2"
      :x-num-ticks="6"
      :radius="4"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
    />
  </div>
</template>
