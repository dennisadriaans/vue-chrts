<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartten']
})

const RevenueData = [
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

const yFormatter = (i: number): string => `${RevenueData[i]?.month}`

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <template #header>
      <h3 class="text-lg font-semibold">
        Revenue Categories
      </h3>
    </template>

    <BarChart
      :data="RevenueData"
      :stacked="true"
      :height="height"
      :categories="RevenueCategoriesMultple"
      :y-axis="['desktop', 'mobile']"
      :group-padding="0"
      :bar-padding="0.2"
      :x-num-ticks="6"
      :radius="4"
      :orientation="Orientation.Horizontal"
      :x-formatter="(i) => i"
      :y-formatter="(i: number): string => `${RevenueData[i]?.month}`"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :x-grid-line="true"
    />
  </UCard>
</template>
