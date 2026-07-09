<script setup lang="ts">
import LibProgressCircle from '~/components/lib/ProgressCircle/ProgressCircle.vue'
import LibStatusTracker from '~/components/lib/StatusTracker/StatusTracker.vue'
import LibCategoryDistribution from '~/components/lib/CategoryDistribution/CategoryDistribution.vue'
import LibCalendar from '~/components/lib/Calendar/Calendar.vue'

const props = defineProps<{
  chartType: 'AreaChart' | 'LineChart' | 'BarChart' | 'DonutChart' | 'ProgressCircle' | 'StatusTracker' | 'CategoryDistribution' | 'Calendar'
  code?: string
}>()

const chartComponent = computed(() => {
  switch (props.chartType) {
    case 'AreaChart': return AreaChart
    case 'LineChart': return LineChart
    case 'BarChart': return BarChart
    case 'DonutChart': return DonutChart
    case 'ProgressCircle': return LibProgressCircle
    case 'StatusTracker': return LibStatusTracker
    case 'CategoryDistribution': return LibCategoryDistribution
    case 'Calendar': return LibCalendar
    default: return 'div'
  }
})
</script>

<template>
  <component
    :is="chartComponent"
    v-bind="$attrs"
    :act-on-responsive-height="false"
  />
</template>
