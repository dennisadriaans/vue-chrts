<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()
const data = [42, 28, 18, 12]
const categories = {
  night: { name: 'Night Ops', color: 'var(--color-slate-950)' },
  dusk: { name: 'Dusk Activity', color: 'var(--color-slate-800)' },
  twilight: { name: 'Twilight', color: 'var(--color-slate-600)' },
  dawn: { name: 'Dawn Events', color: 'var(--color-slate-400)' }
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
  >
    <div class="text-center">
      <div class="text-2xl font-bold text-slate-600">
        42%
      </div>
      <div class="text-dimmed text-xs">
        Night
      </div>
    </div>
  </DonutChart>
</template>
