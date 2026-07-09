<script setup lang="ts">
const data = [60, 40]
const categories = {
  complete: { name: 'Complete', color: '#10b981' },
  pending: { name: 'Pending', color: '#374151' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0.2"
    :type="DonutType.Full"
  >
    <div class="text-center">
      <div class="text-2xl font-bold text-emerald-500">
        60%
      </div>
      <div class="text-dimmed text-xs">
        Complete
      </div>
    </div>
  </DonutChart>
</template>
