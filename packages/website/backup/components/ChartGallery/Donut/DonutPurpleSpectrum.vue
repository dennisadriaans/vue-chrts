<script setup lang="ts">
const data = [45, 25, 20, 10]
const categories = {
  primary: { name: 'Product', color: 'var(--color-indigo-500)' },
  secondary: { name: 'Services', color: 'var(--color-purple-500)' },
  tertiary: { name: 'Support', color: 'var(--color-pink-500)' },
  quaternary: { name: 'Other', color: 'var(--color-rose-500)' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0"
    :type="DonutType.Full"
  >
    <div class="text-center">
      <div class="text-2xl font-bold">
        45%
      </div>
      <div class="text-dimmed text-xs">
        Product
      </div>
    </div>
  </DonutChart>
</template>
