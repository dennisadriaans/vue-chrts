<script setup lang="ts">
const data = [45, 30, 15, 10]
const categories = {
  primary: { name: 'Renewable', color: '#14532d' },
  secondary: { name: 'Efficiency', color: '#15803d' },
  tertiary: { name: 'Savings', color: '#22c55e' },
  quaternary: { name: 'Offset', color: '#86efac' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0.15"
    :type="DonutType.Full"
  >
    <div class="text-center">
      <div class="text-2xl font-bold text-green-600">
        ECO
      </div>
      <div class="text-dimmed text-xs">
        45% Green
      </div>
    </div>
  </DonutChart>
</template>
