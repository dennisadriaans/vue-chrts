<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const neonDonutData = [42, 33, 25]
const neonDonutCategories = {
  hot: { name: 'Hot', color: '#ff3366' },
  warm: { name: 'Warm', color: '#ffcc00' },
  cool: { name: 'Cool', color: '#00ccff' }
}
</script>

<template>
  <div class="flex items-center justify-center py-4">
    <DonutChart
      :legend-position="LegendPosition.BottomCenter"
      :data="neonDonutData"
      :height="200"
      :categories="neonDonutCategories"
      :hide-legend="false"
      :radius="0.1"
      :type="DonutType.Full"
    >
      <div class="text-center">
        <div class="text-2xl font-bold">
          3
        </div>
        <div class="text-dimmed text-xs">
          Zones
        </div>
      </div>
    </DonutChart>
  </div>
</template>
