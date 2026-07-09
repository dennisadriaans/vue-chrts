<script setup lang="ts">
import type { ExpenseCategory } from '../Blocks/Cards.vue'

defineProps<{
  categories: ExpenseCategory[]
}>()

defineOptions({
  tags: ['expense', 'budget', 'card']
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <UCard
    v-for="(category, index) in categories"
    :key="index"
    class="bg-default!"
    :ui="{
      body: 'sm:p-2 p-2'
    }"
  >
    <div class="mb-2 flex items-center justify-between px-2 pt-2 pb-1">
      <div class="flex items-center gap-3">
        <div
          class="h-2 w-2 rounded-full"
          :style="{ backgroundColor: category.color }"
        />
        <span class="font-medium">{{ category.name }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <span
          class="font-medium"
          :class="category.trend >= 0 ? 'text-error' : 'text-success'"
        >
          {{ category.trend >= 0 ? '+' : '' }}{{ category.trend }}%
        </span>
      </div>
    </div>

    <UCard
      variant="soft"
      :ui="{
        body: 'sm:p-4 p-4 bg-elevated/50 rounded-lg'
      }"
    >
      <div class="flex items-center justify-between">
        <div class="text-lg font-semibold">
          {{ formatCurrency(category.value) }}
        </div>
        <div class="text-muted text-sm">
          {{ Math.round((category.value / category.budget) * 100) }}% of budget
        </div>
      </div>

      <!-- Budget progress bar -->
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
        <div
          class="h-full rounded-full transition-all duration-300"
          :style="{
            backgroundColor: category.color,
            width: `${Math.min((category.value / category.budget) * 100, 100)}%`
          }"
        />
      </div>
    </UCard>
  </UCard>
</template>
