<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'withvaluelabel']
})

type DataProps = {
  month?: string
  desktop?: number
  mobile?: number
  date?: string
  value?: number
  visitors?: number
}

const RevenueCategoriesMultiple = {
  desktop: { name: 'Desktop', color: '#3b82f6' },
  mobile: { name: 'Mobile', color: '#22c55e' }
}

const RevenueData: DataProps[] = [
  { month: 'january', desktop: 186, mobile: 80 },
  { month: 'february', desktop: 305, mobile: 200 },
  { month: 'march', desktop: 237, mobile: 120 },
  { month: 'april', desktop: 73, mobile: 190 },
  { month: 'may', desktop: 209, mobile: 130 },
  { month: 'jun', desktop: 214, mobile: 140 }
]

const options = {
  data: RevenueData,
  categories: RevenueCategoriesMultiple,
  valueLabel: {
    label: d => d.y.toString(),
    labelSpacing: 16,
    labelFontSize: 10,
    color: 'var(--ui-text)'

  },
  xNumTicks: 6,
  xAxis: 'month' as keyof DataProps,
  groupPadding: 0,
  barPadding: 0.2,
  xFormatter: (tick: number, i?: number) =>
    `${RevenueData[typeof i !== 'undefined' ? i : tick]?.month}`,
  yFormatter: (tick: number, i?: number) =>
    `${typeof i !== 'undefined' ? tick : tick}`
}
</script>

<template>
  <div>
    <BarChart
      :height="300"
      :y-axis="['desktop', 'mobile']"
      v-bind="options"
    />
  </div>
</template>
