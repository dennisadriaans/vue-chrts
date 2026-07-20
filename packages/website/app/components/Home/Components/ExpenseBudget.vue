<script setup lang="ts">
const category = {
  color: "var(--ui-success)",
  name: "Food & Dining",
  value: 1245,
  budget: 1500,
  trend: -8,
};

const percentOfBudget = Math.round((category.value / category.budget) * 100);

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
</script>

<template>
  <UCard>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="h-2 w-2 rounded-full"
            :style="{ backgroundColor: category.color }"
          />
          <span class="font-medium">{{ category.name }}</span>
        </div>
        <span
          class="text-sm font-medium"
          :class="category.trend >= 0 ? 'text-error' : 'text-success'"
        >
          {{ category.trend >= 0 ? "+" : "" }}{{ category.trend }}%
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-lg font-semibold">
          {{ formatCurrency(category.value) }}
        </div>
        <div class="text-muted text-sm">{{ percentOfBudget }}% of budget</div>
      </div>

      <div class="h-1.5 overflow-hidden rounded-full bg-elevated">
        <div
          class="h-full rounded-full"
          :style="{
            backgroundColor: category.color,
            width: `${Math.min(percentOfBudget, 100)}%`,
          }"
        />
      </div>
    </div>
  </UCard>
</template>
