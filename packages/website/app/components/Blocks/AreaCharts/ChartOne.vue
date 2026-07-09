<script setup lang="ts">
defineOptions({
  tags: ['areacharts', 'chartone']
})

interface SpendingData {
  month: number
  amount: number
  previousYear: number
}

const formatDate = (month: number): string => {
  return new Date(`2025-${month}-02`).toLocaleDateString('en-US', {
    month: 'short'
  })
}

const chartData = ref<SpendingData[]>([
  { month: 1, amount: 0, previousYear: 0 },
  { month: 2, amount: 61200, previousYear: 42100 },
  { month: 3, amount: 59800, previousYear: 41500 },
  { month: 4, amount: 63500, previousYear: 43800 },
  { month: 5, amount: 67200, previousYear: 46300 },
  { month: 6, amount: 71800, previousYear: 49500 },
  { month: 7, amount: 69500, previousYear: 47900 },
  { month: 8, amount: 73200, previousYear: 50400 },
  { month: 9, amount: 75800, previousYear: 52200 },
  { month: 10, amount: 78400, previousYear: 54100 },
  { month: 11, amount: 81200, previousYear: 56000 },
  { month: 12, amount: 84600, previousYear: 58300 }
])

/* It's good practice to format your data early on */
const mappedData = computed<
  { month: string, amount: number, previousYear: number }[]
>(() =>
  chartData.value.map((i) => {
    return {
      month: formatDate(i.month),
      amount: i.amount,
      previousYear: i.previousYear
    }
  })
)

const categories: Record<string, BulletLegendItemInterface> = {
  amount: { name: '2025', color: '#22c55e' },
  previousYear: { name: '2024', color: '#94a3b8' }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const xFormatter = (idx: number) => mappedData.value[idx]?.month ?? ''

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">
          Monthly Revenue
        </h3>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            icon="i-hugeicons:sparkles"
            variant="ghost"
            color="neutral"
          />
        </NuxtLink>
      </div>

      <UCard variant="subtle">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-toned text-sm">vs Last Year</span>
            <UBadge
              variant="soft"
              color="primary"
            >
              <template #leading>
                <UIcon name="i-lucide-arrow-up" />
              </template>
              45%
            </UBadge>
          </div>
          <div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span
                  v-if="categories.amount"
                  class="inline-block h-2 w-2 rounded-sm"
                  :style="`background: ${categories.amount.color}`"
                />
                <span
                  v-if="categories.amount"
                  class="text-toned text-sm"
                >{{
                  categories.amount.name
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="categories.previousYear"
                  class="inline-block h-2 w-2 rounded-sm"
                  :style="`background: ${categories.previousYear.color}`"
                />
                <span
                  v-if="categories.previousYear"
                  class="text-toned text-sm"
                >{{ categories.previousYear.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <UCard variant="soft">
          <AreaChart
            class="dashed"
            :data="mappedData"
            :height="height"
            :categories="categories"
            :y-axis="['amount', 'previousYear']"
            :x-num-ticks="5"
            :y-num-ticks="5"
            :y-grid-line="true"
            :hide-legend="true"
            :x-formatter="xFormatter"
            :y-formatter="formatCurrency"
          />
        </UCard>
      </UCard>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
          <span class="text-muted">Mobile revenue</span>
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
