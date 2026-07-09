<script setup lang="ts">
defineOptions({
  tags: ['linecharts', 'charttwo']
})

const colorMode = useColorMode()

interface BudgetDataItem {
  month: number
  actual: number
  target: number
}

const baseData: BudgetDataItem[] = [
  { month: 1, actual: 2500, target: 2600 },
  { month: 2, actual: 1500, target: 2700 },
  { month: 3, actual: 3000, target: 2900 },
  { month: 4, actual: 4000, target: 3200 },
  { month: 5, actual: 4500, target: 3500 },
  { month: 6, actual: 2800, target: 3600 },
  { month: 7, actual: 3500, target: 3800 },
  { month: 8, actual: 3800, target: 4000 },
  { month: 9, actual: 2000, target: 4200 },
  { month: 10, actual: 4200, target: 4400 },
  { month: 11, actual: 2200, target: 4600 },
  { month: 12, actual: 1800, target: 4800 }
]

const range = ref<'Full year' | 'Last 6 months'>('Full year')

const curveChoice = ref<'Smooth' | 'Linear' | 'Step' | 'Basis'>('Smooth')

const curveMap = computed(() => ({
  Smooth: CurveType.MonotoneX,
  Linear: CurveType.Linear,
  Step: CurveType.StepAfter,
  Basis: CurveType.Basis
}))

const displayedData = computed<BudgetDataItem[]>(() => {
  if (range.value === 'Last 6 months') {
    return baseData.filter(d => d.month >= 7)
  }
  return baseData
})

const Categories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  actual: {
    name: 'Actual',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  },
  target: {
    name: 'Target',
    color: colorMode.value === 'dark' ? '#64748b' : '#475569'
  }
}))
const actualColor = computed(() => {
  const color = Categories.value.actual?.color
  return Array.isArray(color) ? color[0] : (color ?? '#22c55e')
})
const targetColor = computed(() => {
  const color = Categories.value.target?.color
  return Array.isArray(color) ? color[0] : (color ?? '#64748b')
})

const markerConfig = computed(() => ({
  id: 'marker',
  config: {
    actual: {
      type: 'circle' as const,
      size: 7,
      color: actualColor.value,
      strokeColor: actualColor.value,
      strokeWidth: 2
    },
    target: {
      type: 'triangle' as const,
      size: 8,
      color: targetColor.value,
      strokeColor: targetColor.value,
      strokeWidth: 2
    }
  }
}))

const lineDashArray = computed<number[][]>(() => [
  [0, 0],
  [5, 4]
])

const monthLabel = (i: number): string =>
  new Date(`2025-${displayedData.value[i]?.month}-02`).toLocaleDateString(
    'en-US',
    { month: 'short' }
  )

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)

const momChange = computed(() => {
  const arr = displayedData.value
  if (arr.length < 2) return 0
  const prev = arr[arr.length - 2]!.actual
  const curr = arr[arr.length - 1]!.actual
  if (!prev) return 0
  return ((curr - prev) / prev) * 100
})

const { height } = useResponsiveHeight({
  default: 140,
  sm: 260
})
</script>

<template>
  <UCard>
    <div
      class="flex flex-col items-center justify-between gap-4 lg:flex-row"
    >
      <div>
        <h2 class="text-lg font-medium">
          Budget vs actual
        </h2>
        <p class="text-dimmed text-sm">
          Track variance and trend over time
        </p>
      </div>

      <div class="flex items-center gap-2">
        <USelect
          v-model="range"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-chevron-down"
          :items="['Full year', 'Last 6 months']"
          class="w-40"
        />
        <USelect
          v-model="curveChoice"
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-chevron-down"
          :items="['Smooth', 'Linear', 'Step', 'Basis']"
          class="w-36"
        />
      </div>
    </div>

    <UCard class="mt-4">
      <LineChart
        :key="colorMode.value + range + curveChoice"
        :data="displayedData"
        :height="height"
        :categories="Categories"
        :x-formatter="monthLabel"
        :y-formatter="formatCurrency"
        :y-grid-line="true"
        :x-grid-line="true"
        :x-domain-line="true"
        :y-domain-line="true"
        :x-tick-line="true"
        :y-tick-line="true"
        :x-num-ticks="range === 'Full year' ? 12 : 6"
        :y-num-ticks="4"
        :curve-type="curveMap[curveChoice]"
        :legend-position="LegendPosition.TopRight"
        :hide-legend="false"
        :marker-config="markerConfig"
        :line-dash-array="lineDashArray"
      >
        <template #tooltip="{ values }">
          <div
            class="bg-default text-default border-default min-w-32 rounded-lg border p-3 shadow-lg"
          >
            <div class="text-dimmed mb-2 text-xs">
              {{
                new Date(`2025-${values?.month}-02`).toLocaleDateString(
                  'en-US',
                  { month: 'long' }
                )
              }}
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: actualColor }"
                  />
                  <span class="w-24">Actual: </span>
                </div>
                <span class="font-medium">{{
                  formatCurrency(values?.actual ?? 0)
                }}</span>
              </div>

              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: targetColor }"
                  />
                  <span>Target</span>
                </div>
                <span class="font-medium">{{
                  formatCurrency(values?.target ?? 0)
                }}</span>
              </div>

              <hr class="border-default my-2">

              <div class="flex justify-between text-sm">
                <span>Variance</span>
                <span
                  class="font-semibold"
                  :class="
                    (values?.actual ?? 0) - (values?.target ?? 0) >= 0
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{
                    formatCurrency(
                      (values?.actual ?? 0) - (values?.target ?? 0)
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </LineChart>
    </UCard>

    <div class="space-y-4 mt-6 text-center">
      <strong>Insight</strong>
      <p class="text-dimmed block text-sm max-w-sm mt-2 mx-auto">
        Actuals trend {{ momChange >= 0 ? 'upward' : 'downward' }} this
        month. Review categories exceeding the target to optimize spend.
      </p>
      <div class="flex justify-center gap-2">
        <UButton color="neutral">
          Open report
        </UButton>
        <UButton
          variant="link"
          color="neutral"
        >
          Dismiss
        </UButton>
      </div>
    </div>
  </UCard>
</template>
