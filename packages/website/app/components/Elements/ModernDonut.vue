<script setup lang="ts">
const dataPoints = ref([
  { name: 'Desktop', value: 45, color: '#06b6d4' },
  { name: 'Mobile', value: 35, color: '#8b5cf6' },
  { name: 'Tablet', value: 20, color: '#f97316' }
])

const total = computed(() => dataPoints.value.reduce((acc, curr) => acc + curr.value, 0))

const categories = computed(() => {
  return Object.fromEntries(
    dataPoints.value.map(item => [
      item.name,
      {
        name: item.name,
        color: item.color,
        percentage: item.value
      }
    ])
  )
})
</script>

<template>
  <UCard class="bg-default dark:bg-elevated/20">
    <h2 class="text-2xl font-bold">
      Monthly Leads
    </h2>

    <DonutChart
      :data="dataPoints.map(d => d.value)"
      :categories="categories"
      :height="200"
      :arc-width="20"
      :pad-angle="0.05"
      :radius="4"
      :hide-legend="true"
      class="my-10"
    >
      <div class="flex flex-col items-center justify-center">
        <span class="text-3xl font-bold text-highlighted">{{ total }}</span>
        <span class="text-xs text-muted uppercase tracking-wider font-medium mt-1">Total</span>
      </div>
    </DonutChart>

    <div class="flex w-full gap-4">
      <div
        v-for="item in dataPoints"
        :key="item.name"
        class="flex flex-1 items-center justify-center gap-2 pt-4"
      >
        <div
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: item.color }"
        />
        <span class="text-lg font-medium text-muted">{{ item.name }}</span>
      </div>
    </div>
  </UCard>
</template>
