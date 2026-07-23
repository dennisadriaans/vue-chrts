<script setup lang="ts">
const data = [35, 28, 22, 15]
const categories = {
  chrome: { name: 'Chrome', color: '#facc15' },
  safari: { name: 'Safari', color: '#3b82f6' },
  firefox: { name: 'Firefox', color: '#f97316' },
  edge: { name: 'Edge', color: '#06b6d4' }
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
      <div class="text-lg font-bold">
        4
      </div>
      <div class="text-dimmed text-xs">
        Browsers
      </div>
    </div>
  </DonutChart>
</template>
