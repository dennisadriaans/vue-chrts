<script setup lang="ts">
const data = [55, 30, 15]
const categories = {
  high: { name: 'High', color: '#ef4444' },
  medium: { name: 'Medium', color: '#eab308' },
  low: { name: 'Low', color: '#22c55e' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0.1"
    :type="DonutType.Full"
  >
    <div class="text-center">
      <div class="text-2xl font-bold">
        55%
      </div>
      <div class="text-dimmed text-xs">
        High
      </div>
    </div>
  </DonutChart>
</template>
