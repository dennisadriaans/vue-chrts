<script lang="ts" setup>
const charts = [
  {
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
  },
  {
    name: 'Users',
    value: '2,405',
    type: 'bar',
    data: [
      { date: 'Jan', value: 40 },
      { date: 'Feb', value: 60 },
      { date: 'Mar', value: 50 },
      { date: 'Apr', value: 80 },
      { date: 'May', value: 70 },
      { date: 'Jun', value: 90 }
    ],
    color: 'var(--ui-info)'
  },
  {
    name: 'Sessions',
    value: '12,543',
    type: 'line',
    data: [
      { date: 'Jan', value: 20 },
      { date: 'Feb', value: 18 },
      { date: 'Mar', value: 22 },
      { date: 'Apr', value: 19 },
      { date: 'May', value: 24 },
      { date: 'Jun', value: 28 }
    ],
    color: 'var(--ui-warning)'
  }
]
</script>

<template>
  <UCard
    v-for="(chartProps, index) in charts"
    :key="index"
    class="bg-default!"
  >
    <div class="font-medium text-dimmed">
      {{ chartProps.name }}
    </div>
    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold">
        {{ chartProps.value }}
      </div>
      <div class="h-12 w-28">
        <AreaChart
          v-if="chartProps.type === 'area'"
          :data="chartProps.data"
          index="date"
          :categories="{
            value: {
              name: 'value',
              color: chartProps.color
            }
          }"
          :height="48"
          :hide-x-axis="true"
          :hide-y-axis="true"
          :hide-legend="true"
          :hide-tooltip="true"
        />
        <BarChart
          v-else-if="chartProps.type === 'bar'"
          :data="chartProps.data"
          :y-axis="['value']"
          :categories="{
            value: {
              name: 'value',
              color: chartProps.color
            }
          }"
          :height="48"
          :hide-x-axis="true"
          :hide-y-axis="true"
          :hide-legend="true"
          :hide-tooltip="true"
        />
        <LineChart
          v-else-if="chartProps.type === 'line'"
          :data="chartProps.data"
          index="date"
          :categories="{
            value: {
              name: 'value',
              color: chartProps.color
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
  </UCard>
</template>
