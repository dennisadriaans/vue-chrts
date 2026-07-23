<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartfourteen']
})

interface ProgressData {
  date: string
  expenses: number
}

const chartData = ref<ProgressData[]>([
  { date: 'Apr 14', expenses: 300 },
  { date: 'Apr 15', expenses: 500 },
  { date: 'Apr 16', expenses: 700 },
  { date: 'Apr 17', expenses: 900 },
  { date: 'Apr 18', expenses: 1100 },
  { date: 'Apr 19', expenses: 1300 },
  { date: 'Apr 20', expenses: 1500 }
])

const categories = computed(() => ({
  expenses: { name: 'Expenses', color: 'var(--ui-indigo)' }
}))

const xFormatter = (i: number): string => `${chartData.value[i]?.date}`

const { height } = useResponsiveHeight({
  default: 200,
  sm: 200
})

const formatCurrency = (value: number) => {
  if (value === 0) return '0'
  return `${(value / 1000).toFixed(0)}k`
}
</script>

<template>
  <UCard class="bg-default dark:bg-elevated/20">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-2xl font-bold">
          Payroll Reports
        </h3>
        <div class="flex gap-4 mt-6">
          <div class="space-y-1">
            <div class="text-sm text-dimmed font-medium">
              Total Salary
            </div>
            <div class="text-xl font-bold text-default">
              $22,459
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-sm text-dimmed font-medium">
              Total Comp
            </div>
            <div class="text-xl font-bold text-default">
              $20,259
            </div>
          </div>
        </div>
      </div>
      <USelect
        size="sm"
        :items="['Monthly', 'Yearly']"
        model-value="Monthly"
        class="w-24"
      />
    </div>

    <div class=" w-full mt-4">
      <BarChart
        :data="chartData"
        :categories="categories"
        :height="height"
        :y-axis="['expenses']"
        :y-formatter="formatCurrency"
        :x-formatter="xFormatter"
        :y-grid-line="true"
        :hide-legend="true"
        :x-num-ticks="8"
        :radius="4"
      />
    </div>
  </UCard>
</template>
