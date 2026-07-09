<script setup lang="ts">
const data = [38, 32, 30]
const categories = {
  deep: { name: 'Deep Rose', color: 'var(--color-rose-900)' },
  mid: { name: 'Mid Pink', color: 'var(--color-rose-500)' },
  light: { name: 'Light Blush', color: 'var(--color-rose-300)' }
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
    :pad-angle="0.04"
  >
    <div class="text-center text-rose-400 font-semibold">
      SOFT
    </div>
  </DonutChart>
</template>
