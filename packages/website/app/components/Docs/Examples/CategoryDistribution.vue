<script setup lang="ts">
const exampleCategories = [
  { label: 'Marketing', percentage: 40, color: 'var(--color-indigo-500)', value: 4000 },
  { label: 'Sales', percentage: 25, color: 'var(--color-cyan-400)', value: 2500 },
  { label: 'Development', percentage: 20, color: 'var(--color-emerald-500)', value: 2000 },
  { label: 'Support', percentage: 15, color: 'var(--color-orange-500)', value: 1500 }
]

const exampleTrend = {
  value: '+8.2%',
  direction: 'up' as const
}
</script>

<template>
  <UCard
    class="w-full"
  >
    <div class="flex w-full items-center justify-center ">
      <LibCategoryDistribution
        :primary-value="100"
        gap="lg"
        :categories="exampleCategories"
        :trend="exampleTrend"
        legend-class="mt-4"
        class="mx-auto w-full max-w-lg"
      />
    </div>
  </UCard>
</template>
