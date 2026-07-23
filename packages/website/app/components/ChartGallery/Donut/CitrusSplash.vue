<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()
const data = [35, 30, 25, 10]
const categories = {
  orange: { name: 'Orange', color: '#ea580c' },
  yellow: { name: 'Lemon', color: '#eab308' },
  lime: { name: 'Lime', color: '#65a30d' },
  green: { name: 'Grapefruit', color: '#16a34a' }
}
</script>

<template>
  <DonutChart
    :legend-position="LegendPosition.BottomCenter"
    :data="data"
    :height="height"
    :categories="categories"
    :hide-legend="false"
    :radius="0"
    :arc-width="40"
    :type="DonutType.Full"
    :pad-angle="0.05"
  >
    <div class="text-center">
      <UIcon
        name="i-lucide-zap"
        class="h-6 w-6 text-yellow-500 mx-auto"
      />
    </div>
  </DonutChart>
</template>
