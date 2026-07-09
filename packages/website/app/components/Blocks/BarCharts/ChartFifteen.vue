<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chart-fifteen']
})

const chartData = ref([
  { country: 'Netherlands', frontendSalary: 75000, backendSalary: 80000 },
  { country: 'Germany', frontendSalary: 80000, backendSalary: 85000 },
  { country: 'France', frontendSalary: 70000, backendSalary: 75000 },
  { country: 'Spain', frontendSalary: 55000, backendSalary: 60000 }
])

const categories = {
  frontendSalary: { name: 'Frontend Salary', color: '#3b82f6' },
  backendSalary: { name: 'Backend Salary', color: '#8b5cf6' }
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard>
    <h2 class="text-lg font-medium">
      Developer Salaries Across Europe
    </h2>

    <div class="border-default mt-8 border-y py-6 sm:py-8">
      <BarChart
        :data="chartData"
        :height="height"
        x-axis="country"
        :y-axis="['frontendSalary', 'backendSalary']"
        :radius="10"
        :bar-padding="0.3"
        :y-formatter="(i) => chartData[i].country"
        :categories="categories"
        :legend-position="LegendPosition.TopRight"
        :orientation="Orientation.Horizontal"
      />
    </div>

    <div class="mt-8 flex items-center justify-between">
      <UButton
        type="button"
        variant="outline"
        color="neutral"
      >
        <UIcon
          name="i-heroicons-chevron-up"
          class="h-4 w-4"
          aria-hidden="true"
        />
        Less details
      </UButton>
      <UButton
        type="button"
        variant="outline"
        color="neutral"
      >
        <UIcon
          name="i-heroicons-arrow-up-tray"
          class="h-4 w-4"
          aria-hidden="true"
        />
        Export
      </UButton>
    </div>
  </UCard>
</template>
