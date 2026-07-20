<script lang="ts" setup>
const chart = {
  name: 'Revenue',
  value: '$45,231',
  type: 'area',
  data: [
    { date: 'Jan', value: 10 },
    { date: 'Feb', value: 30 },
    { date: 'Mar', value: 20 },
    { date: 'Apr', value: 50 },
    { date: 'May', value: 40 },
    { date: 'Jun', value: 70 }
  ],
  color: 'var(--ui-success)'
}
</script>

<template>
  <div class="font-medium text-dimmed">
    {{ chart.name }}
  </div>
  <div class="flex items-center justify-between">
    <div class="text-2xl font-semibold">
      {{ chart.value }}
    </div>
    <div class="h-12 w-28">
      <AreaChart
        :data="chart.data"
        index="date"
        :categories="{
          value: {
            name: 'value',
            color: chart.color
          }
        }"
        :height="48"
        :hide-x-axis="true"
        :hide-y-axis="true"
        :hide-legend="true"
        :hide-tooltip="true"
      />
    </div>
  </div>
</template>
