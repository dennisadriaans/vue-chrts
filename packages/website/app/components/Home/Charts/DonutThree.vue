<script lang="ts" setup>
interface ExpenseCategory {
  color: string
  name: string
  value: number
}

const expenseData = ref<ExpenseCategory[]>([
  { color: '#10b981', name: 'Food & Dining', value: 1245 },
  { color: '#3b82f6', name: 'Software & Tools', value: 890 },
  { color: '#f59e0b', name: 'Travel & Transport', value: 675 }
])

const selectedPeriod = ref('This month')
const periods = ['This month', 'Last month', 'This quarter', 'This year']

const totalSpent = computed(() =>
  expenseData.value.reduce((sum, item) => sum + item.value, 0)
)

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)

const categories = computed(() =>
  expenseData.value.reduce(
    (acc, item, index) => {
      acc[index.toString()] = {
        name: item.name,
        color: item.color,
        percentage: item.value
      }
      return acc
    },
    {} as Record<string, { name: string, color: string, percentage: number }>
  )
)
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-2">
      <div>
        <div class="text-sm font-medium">
          Spending Summary
        </div>
        <div class="text-muted text-xs">
          Monthly expense breakdown
        </div>
      </div>
      <USelect
        v-model="selectedPeriod"
        :items="periods"
        color="neutral"
        variant="outline"
        size="xs"
        trailing-icon="i-lucide-chevron-down"
      />
    </div>

    <DonutChart
      :data="expenseData.map((i) => i.value)"
      :height="140"
      :categories="categories"
      :hide-legend="true"
      :radius="0"
      :type="DonutType.Half"
    >
      <div class="mt-10 text-center">
        <div class="text-muted text-xs">
          Total Spent
        </div>
        <div class="text-xl font-bold">
          {{ formatCurrency(totalSpent) }}
        </div>
      </div>
    </DonutChart>
  </div>
</template>
