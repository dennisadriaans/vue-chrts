<script setup lang="ts">
const data = [35, 25, 20, 15, 5]
const categories = {
  primary: { name: 'Core', color: '#f97316' },
  secondary: { name: 'Services', color: '#fb923c' },
  tertiary: { name: 'Add-ons', color: '#fdba74' },
  quaternary: { name: 'Support', color: '#fed7aa' },
  other: { name: 'Misc', color: '#ffedd5' }
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
    <div class="text-center">
      <div class="text-2xl font-bold text-orange-500">
        35%
      </div>
      <div class="text-dimmed text-xs">
        Primary
      </div>
    </div>
  </DonutChart>
</template>
