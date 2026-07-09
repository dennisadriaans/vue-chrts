<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'groupedfinancial']
})

const colorMode = useColorMode()

interface DepartmentDataItem {
  department: string
  budget: number
  actual: number
  projected: number
  variance: number
}

const DepartmentData: DepartmentDataItem[] = [
  {
    department: 'Engineering',
    budget: 850,
    actual: 820,
    projected: 890,
    variance: 40
  },
  {
    department: 'Marketing',
    budget: 450,
    actual: 480,
    projected: 520,
    variance: 70
  },
  {
    department: 'Sales',
    budget: 620,
    actual: 680,
    projected: 720,
    variance: 100
  },
  {
    department: 'Operations',
    budget: 380,
    actual: 360,
    projected: 400,
    variance: 20
  },
  { department: 'HR', budget: 280, actual: 265, projected: 290, variance: 10 },
  {
    department: 'Finance',
    budget: 320,
    actual: 310,
    projected: 340,
    variance: 20
  }
]

const DepartmentCategories = computed(() => ({
  budget: {
    name: 'Budget',
    color: colorMode.value === 'dark' ? '#6b7280' : '#4b5563'
  },
  actual: {
    name: 'Actual Spend',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  projected: {
    name: 'Projected',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  },
  variance: {
    name: 'Variance',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  }
}))

const xFormatter = (i: number): string => `${DepartmentData[i]?.department}`
const yFormatter = (value: number): string => `$${value}k`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="DepartmentData"
    :height="300"
    :categories="DepartmentCategories"
    :y-axis="['budget', 'actual', 'projected', 'variance']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-tick-line="true"
    :x-tick-line="false"
    :radius="6"
    :group-padding="0.15"
    :bar-padding="0.08"
    :x-num-ticks="6"
    :y-num-ticks="6"
    x-label="Departments"
    y-label="Budget ($K)"
  />
</template>
