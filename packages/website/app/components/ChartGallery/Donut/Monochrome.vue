<script setup lang="ts">
const data = [40, 25, 20, 15]
const categories = {
  darkest: { name: 'Q1', color: '#18181b' },
  dark: { name: 'Q2', color: '#3f3f46' },
  medium: { name: 'Q3', color: '#71717a' },
  light: { name: 'Q4', color: '#a1a1aa' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0.05"
    :type="DonutType.Full"
  >
    <div class="text-center font-black">
      BW
    </div>
  </DonutChart>
</template>
