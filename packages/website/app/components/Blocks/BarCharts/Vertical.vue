<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'vertical']
})

const { showTitle = false } = defineProps<{
  showTitle?: boolean
}>()

const RevenueData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]

const RevenueCategories = computed(() => ({
  desktop: {
    name: 'Desktop',
    color: '#22c55e'
  }
}))

const xFormatter = (i: number): string => `${RevenueData[i]?.month}`
const yFormatter = (tick: number) => tick.toString()
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
      :height="300"
      :categories="RevenueCategories"
      :y-axis="['desktop']"
      :x-num-ticks="6"
      :radius="4"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>
