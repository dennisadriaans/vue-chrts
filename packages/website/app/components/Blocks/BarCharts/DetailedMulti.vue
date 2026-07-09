<script lang="ts" setup>
defineOptions({
  tags: ['barcharts', 'detailedmulti']
})

const colorMode = useColorMode()

interface TeamDataItem {
  quarter: string
  frontend: number
  backend: number
  devops: number
  qa: number
}

const TeamData: TeamDataItem[] = [
  { quarter: 'Q1', frontend: 45, backend: 52, devops: 38, qa: 42 },
  { quarter: 'Q2', frontend: 48, backend: 55, devops: 41, qa: 45 },
  { quarter: 'Q3', frontend: 52, backend: 58, devops: 44, qa: 48 },
  { quarter: 'Q4', frontend: 55, backend: 61, devops: 47, qa: 51 }
]

const TeamCategories = computed(() => ({
  frontend: {
    name: 'Frontend',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  backend: {
    name: 'Backend',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  },
  devops: {
    name: 'DevOps',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  },
  qa: {
    name: 'QA',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  }
}))

const xFormatter = (i: number): string => `${TeamData[i]?.quarter}`
const yFormatter = (value: number): string => `${value}h`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="TeamData"
    :height="300"
    :categories="TeamCategories"
    :y-axis="['frontend', 'backend', 'devops', 'qa']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :y-grid-line="true"
    :x-grid-line="true"
    :y-tick-line="true"
    :x-tick-line="true"
    :x-num-ticks="4"
    :y-num-ticks="6"
    :radius="2"
    :group-padding="0.1"
    :bar-padding="0.1"
    x-label="Quarter"
    y-label="Hours Worked"
  />
</template>
