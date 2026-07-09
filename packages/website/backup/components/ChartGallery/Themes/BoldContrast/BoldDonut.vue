<script setup lang="ts">
interface Props { height: number }
defineProps<Props>()

const boldDonutData = [50, 50]
const boldDonutCategories = {
  yin: { name: 'Yin', color: '#18181b' },
  yang: { name: 'Yang', color: '#fafafa' }
}
</script>

<template>
  <div class="flex items-center justify-center py-4">
    <DonutChart
      :legend-position="LegendPosition.BottomCenter"
      :data="boldDonutData"
      :height="200"
      :categories="boldDonutCategories"
      :hide-legend="false"
      :radius="0"
      :type="DonutType.Full"
    >
      <div class="text-center">
        <div class="text-2xl font-bold">
          50/50
        </div>
      </div>
    </DonutChart>
  </div>
</template>
