<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartthree']
})

const selected = ref('day')
const selectOptions = [
  { label: 'Per day', value: 'day' },
  { label: 'Per week', value: 'week' },
  { label: 'Per month', value: 'month' }
]

const chartData = ref([
  { label: 'Q1', active: 1000, resting: 500 },
  { label: 'Q2', active: 1800, resting: 800 },
  { label: 'Q3', active: 1400, resting: 900 },
  { label: 'Q4', active: 2000, resting: 1100 }
])

const categories: Record<string, BulletLegendItemInterface> = {
  active: { name: 'Active calories', color: '#6366f1' },
  resting: { name: 'Resting calories', color: 'var(--ui-bg-accented)' }
}

const xFormatter = (v: number) => v.toLocaleString()
const yFormatter = (i: number) => chartData.value[i]?.label ?? ''
const tooltipFormatter = (v: number) => v.toLocaleString()
const tooltipTitleFormatter = (i: number) => chartData.value[i]?.label ?? ''

const { height } = useResponsiveHeight({
  default: 200,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <div class="flex items-center justify-between">
      <h2 class="text-default text-sm font-semibold tracking-tight">
        Avg. Energy Activity
      </h2>
      <USelect
        v-model="selected"
        :items="selectOptions"
        variant="outline"
        color="neutral"
        class="min-w-24"
      />
    </div>

    <div class="mt-4">
      <div class="flex items-baseline gap-1">
        <span class="text-default text-3xl font-bold tracking-tight">2,589</span>
        <span class="text-dimmed text-lg font-medium">kcal</span>
      </div>
    </div>

    <UCard
      variant="soft"
      class="mt-2"
    >
      <BarChart
        :data="chartData"
        :height="height"
        :categories="categories"
        :y-axis="['active', 'resting']"
        :radius="8"
        :bar-padding="0.4"
        :group-padding="30"
        :stacked="true"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :tooltip-formatter="tooltipFormatter"
        :tooltip-title-formatter="tooltipTitleFormatter"
        :legend-position="LegendPosition.BottomCenter"
        :orientation="Orientation.Horizontal"
        :show-grid-lines="true"
        :hide-legend="true"
        y-label="2025"
      />
    </UCard>

    <div class="mt-4 flex flex-wrap items-center justify-center gap-4">
      <div
        v-for="(config, key) in categories"
        :key="key"
        class="flex items-center gap-2"
      >
        <div
          class="size-2 rounded-full"
          :style="{ backgroundColor: (config.color as string) }"
        />
        <span class="text-dimmed text-xs font-medium">{{ config.name }}</span>
      </div>
    </div>
  </UCard>
</template>
