<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartsix']
})

type RevenueDataItem = {
  month: string
  desktop: number
  mobile: number
}

const RevenueData: RevenueDataItem[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 100, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
  { month: 'July', desktop: 245, mobile: 160 },
  { month: 'August', desktop: 310, mobile: 190 },
  { month: 'September', desktop: 280, mobile: 210 },
  { month: 'October', desktop: 340, mobile: 250 },
  { month: 'November', desktop: 420, mobile: 310 },
  { month: 'December', desktop: 480, mobile: 380 }
]

const RevenueCategories = computed(() => ({
  desktop: {
    name: 'Desktop',
    color: '#22c55e'
  },
  mobile: {
    name: 'Mobile',
    color: 'var(--ui-bg-accented)'
  }
}))

const xFormatter = (i: number): string => `${RevenueData[i]?.month}`
const yFormatter = (i: number): string => `${i}`

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <template #header>
      <h3 class="text-lg font-semibold">
        Revenue
      </h3>
    </template>

    <BarChart
      :data="RevenueData"
      :height="height"
      :categories="RevenueCategories"
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
  </UCard>
</template>
