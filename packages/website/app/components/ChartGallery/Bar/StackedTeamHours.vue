<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

interface Props {
  height?: number
  actOnResponsiveHeight?: boolean
}

const { height, actOnResponsiveHeight = true } = defineProps<Props>()

const colorMode = useColorMode()
const { height: responsiveHeight } = useResponsiveHeight({
  default: 200,
  sm: 300
})

const chartHeight = computed(() => {
  if (actOnResponsiveHeight) {
    return responsiveHeight.value
  }

  return height ?? responsiveHeight.value
})

interface StackedDataItem {
  month: string
  frontend: number
  backend: number
  devops: number
  design: number
}

const TeamHoursData: StackedDataItem[] = [
  { month: 'Jan', frontend: 320, backend: 280, devops: 160, design: 180 },
  { month: 'Feb', frontend: 360, backend: 310, devops: 180, design: 200 },
  { month: 'Mar', frontend: 340, backend: 290, devops: 170, design: 190 },
  { month: 'Apr', frontend: 380, backend: 330, devops: 200, design: 220 },
  { month: 'May', frontend: 420, backend: 360, devops: 220, design: 240 },
  { month: 'Jun', frontend: 400, backend: 340, devops: 210, design: 230 }
]

const TeamCategories = computed(() => ({
  frontend: {
    name: 'Frontend',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  backend: {
    name: 'Backend',
    color: colorMode.value === 'dark' ? '#8b5cf6' : '#7c3aed'
  },
  devops: {
    name: 'DevOps',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  },
  design: {
    name: 'Design',
    color: colorMode.value === 'dark' ? '#ec4899' : '#db2777'
  }
}))

const xFormatter = (i: number): string => `${TeamHoursData[i]?.month}`
const yFormatter = (value: number): string => `${value}h`
</script>

<template>
  <BarChart
    :key="colorMode.value"
    :data="TeamHoursData"
    :height="chartHeight"
    :stacked="true"
    :categories="TeamCategories"
    :y-axis="['frontend', 'backend', 'devops', 'design']"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :y-tick-line="true"
    :x-tick-line="false"
    :radius="8"
    :bar-padding="0.25"
    :x-num-ticks="6"
    :y-num-ticks="5"
    x-label="Month"
    y-label="Hours"
    v-bind="$attrs"
  />
</template>
