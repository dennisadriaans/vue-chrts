<script setup lang="ts">
const data = [30, 25, 25, 20]
const categories = {
  gold: { name: 'Gold Tier', color: '#a16207' },
  amber: { name: 'Amber Level', color: '#d97706' },
  yellow: { name: 'Yellow Band', color: '#fbbf24' },
  cream: { name: 'Cream Base', color: '#fef3c7' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="200"
    :categories="categories"
    :hide-legend="false"
    :radius="0.08"
    :type="DonutType.Full"
    :pad-angle="0.01"
  >
    <div class="text-center text-amber-600 font-bold">
      GOLD
    </div>
  </DonutChart>
</template>
