<script setup lang="ts">
const data = [40, 35, 25]
const categories = {
  deep: { name: 'Deep Sea', color: '#0c4a6e' },
  mid: { name: 'Mid Ocean', color: '#0284c7' },
  surface: { name: 'Surface', color: '#7dd3fc' }
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
    :pad-angle="0.03"
  >
    <div class="text-center">
      <div class="text-2xl font-bold text-sky-600">
        40%
      </div>
      <div class="text-dimmed text-xs">
        Deep Sea
      </div>
    </div>
  </DonutChart>
</template>
