<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const monoDonutData = [70, 30]
const monoDonutCategories = {
  filled: { name: 'Progress', color: '#1f2937' },
  empty: { name: 'Remaining', color: '#e5e7eb' }
}
</script>

<template>
  <div class="flex items-center justify-center py-4">
    <DonutChart
      :legend-position="LegendPosition.BottomCenter"
      :data="monoDonutData"
      :height="200"
      :categories="monoDonutCategories"
      :hide-legend="false"
      :radius="0"
      :type="DonutType.Full"
    >
      <div class="text-center">
        <div class="text-3xl font-bold">
          70%
        </div>
      </div>
    </DonutChart>
  </div>
</template>
