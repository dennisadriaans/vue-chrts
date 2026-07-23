<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const pastelDonutData = [40, 35, 25]
const pastelDonutCategories = {
  lavender: { name: 'Lavender', color: '#ddd6fe' },
  blush: { name: 'Blush', color: '#fecdd3' },
  sky: { name: 'Sky', color: '#bae6fd' }
}
</script>

<template>
  <div class="flex items-center justify-center py-4">
    <DonutChart
      :legend-position="LegendPosition.BottomCenter"
      :data="pastelDonutData"
      :height="200"
      :categories="pastelDonutCategories"
      :hide-legend="false"
      :radius="0.15"
      :type="DonutType.Full"
    >
      <div class="text-center">
        <div class="text-lg font-medium text-dimmed">
          Balance
        </div>
      </div>
    </DonutChart>
  </div>
</template>
