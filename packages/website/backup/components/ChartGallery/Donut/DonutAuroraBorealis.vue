<script setup lang="ts">
const data = [28, 24, 20, 16, 12]
const categories = {
  violet: { name: 'Innovation', color: '#7c3aed' },
  indigo: { name: 'Dev', color: '#4f46e5' },
  cyan: { name: 'Research', color: '#06b6d4' },
  emerald: { name: 'Marketing', color: '#10b981' },
  lime: { name: 'Support', color: '#84cc16' }
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
    :pad-angle="0.02"
  >
    <div class="text-center font-bold bg-gradient-to-tr from-violet-500 to-emerald-500 bg-clip-text text-transparent">
      AURORA
    </div>
  </DonutChart>
</template>
