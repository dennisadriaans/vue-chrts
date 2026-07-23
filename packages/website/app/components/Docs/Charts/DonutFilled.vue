<script lang="ts" setup>
defineOptions({
  tags: ['donutcharts', 'basic']
})

const data = [
  { name: 'Night Ops', percentage: 42 },
  { name: 'Dusk Activity', percentage: 28 },
  { name: 'Twilight', percentage: 18 },
  { name: 'Dawn Events', percentage: 12 }
]

const categories = {
  night: {
    name: 'Night Ops',
    color: 'var(--color-slate-950)'
  },
  dusk: {
    name: 'Dusk Activity',
    color: 'var(--color-slate-800)'
  },
  twilight: {
    name: 'Twilight',
    color: 'var(--color-slate-600)'
  },
  dawn: {
    name: 'Dawn Events',
    color: 'var(--color-slate-400)'
  }
}

function getCategoryColor(label?: string) {
  return Object.values(categories).find(c => c.name === label)?.color
}
</script>

<template>
  <div class="relative">
    <DonutChart
      :data="data.map((i) => i.percentage)"
      :height="160"
      :radius="0"
      :categories="categories"
      :hide-legend="true"
      :type="DonutType.Full"
      :pad-angle="0"
      :arc-width="0"
    >
      <template #tooltip="{ values }">
        <div class="flex items-center gap-2 p-2 text-default">
          <div
            class="size-3 rounded-full"
            :style="{
              backgroundColor: getCategoryColor(values?.label)
            }"
          />
          <span class="mr-1 text-dimmed">
            {{ values?.label }}
          </span>
          {{ values ? values[values?.label] : '' }}
        </div>
      </template>
    </DonutChart>
  </div>
</template>
