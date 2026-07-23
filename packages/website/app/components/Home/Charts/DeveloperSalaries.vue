<script setup lang="ts">
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
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-sm font-medium">
      Developer Salaries Across Europe
    </h3>
    <BarChart
      :data="chartData"
      :height="160"
      x-axis="country"
      :y-axis="['frontendSalary', 'backendSalary']"
      :radius="8"
      :bar-padding="0.3"
      :y-formatter="(i) => chartData[i]?.country ?? ''"
      :categories="categories"
      :legend-position="LegendPosition.TopRight"
      :orientation="Orientation.Horizontal"
      :hide-legend="false"
    />
  </div>
</template>
