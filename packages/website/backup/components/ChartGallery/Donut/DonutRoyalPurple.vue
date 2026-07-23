<script setup lang="ts">
const data = [55, 25, 20]
const categories = {
  premium: { name: 'Premium', color: '#581c87' },
  standard: { name: 'Standard', color: '#9333ea' },
  basic: { name: 'Basic', color: '#d8b4fe' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0.25"
    :type="DonutType.Full"
    :pad-angle="0.02"
  >
    <div class="text-center">
      <div class="text-2xl font-bold text-purple-600">
        VIP
      </div>
      <div class="text-dimmed text-xs">
        55% Tier
      </div>
    </div>
  </DonutChart>
</template>
