<script lang="ts" setup>
defineOptions({
  tags: ['donutcharts', 'chartthree']
})

interface ExpenseCategory {
  color: string
  name: string
  value: number
}

const expenseData = ref<ExpenseCategory[]>([
  {
    color: '#10b981',
    name: 'Food & Dining',
    value: 1245
  },
  {
    color: '#3b82f6',
    name: 'Software & Tools',
    value: 890
  },
  {
    color: '#f59e0b',
    name: 'Travel & Transport',
    value: 675
  }
])

const selectedPeriod = ref('This month')
const periods = ['This month', 'Last month', 'This quarter', 'This year']

const totalSpent = computed(() =>
  expenseData.value.reduce((sum, item) => sum + item.value, 0)
)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <div class="mx-auto max-w-lg p-2">
    <UCard class="!bg-default">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium">
              Spending Summary
            </h2>
            <p class="text-muted text-sm">
              Monthly expense breakdown
            </p>
          </div>
          <USelect
            v-model="selectedPeriod"
            :items="periods"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
          />
        </div>
      </template>

      <div class="flex flex-col items-center">
        <DonutChart
          :data="expenseData.map((i) => i.value)"
          :height="180"
          :categories="
            expenseData.reduce(
              (acc, item, index) => {
                acc[index.toString()] = {
                  name: item.name,
                  color: item.color,
                  percentage: item.value
                }
                return acc
              },
              {} as Record<
                string,
                { name: string; color: string; percentage: number }
              >
            )
          "
          :hide-legend="true"
          :radius="0"
          :type="DonutType.Half"
        >
          <div class="mt-16 text-center">
            <div class="text-muted text-xs">
              Total Spent
            </div>
            <div class="text-2xl font-bold">
              {{ formatCurrency(totalSpent) }}
            </div>
          </div>
        </DonutChart>

        <!-- Simple legend -->
        <div class="mt-4 grid w-full max-w-lg grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            v-for="(category, index) in expenseData"
            :key="index"
            class="text-center text-sm"
          >
            <div class="mb-1 flex items-center justify-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                :style="{ backgroundColor: category.color }"
              />
              <span class="text-muted">{{ category.name }}</span>
            </div>
            <div class="text-lg font-semibold">
              {{ formatCurrency(category.value) }}
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UButton
            variant="link"
            trailing-icon="i-lucide-external-link"
            color="neutral"
          >
            View Detailed Report
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
