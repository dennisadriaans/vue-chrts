<script lang="ts" setup>
const colorMode = useColorMode()

defineOptions({
  tags: ['donutcharts', 'chartone']
})

const systemData = [45, 30, 25]

const systemCategories = computed(() => ({
  'CPU Usage': {
    name: 'CPU Usage',
    color: colorMode.value === 'dark' ? '#ef4444' : '#dc2626'
  },
  'Memory Usage': {
    name: 'Memory Usage',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  'Network I/O': {
    name: 'Network I/O',
    color: colorMode.value === 'dark' ? '#10b981' : '#059669'
  }
}))

const items = computed(() => [
  { ...systemCategories.value['CPU Usage'], value: systemData[0] },
  { ...systemCategories.value['Memory Usage'], value: systemData[1] },
  { ...systemCategories.value['Network I/O'], value: systemData[2] }
])
</script>

<template>
  <UCard class="mx-auto max-w-sm bg-default!">
    <template #header>
      <h2 class="text-highlighted text-lg font-medium">
        System Performance
      </h2>
      <p class="text-muted text-sm">
        Core resource utilization
      </p>
    </template>

    <div class="flex flex-col gap-8">
      <DonutChart
        :data="systemData"
        :height="160"
        :type="DonutType.Full"
        :radius="6"
        :arc-width="15"
        :pad-angle="0.1"
        :categories="systemCategories"
        :hide-legend="true"
      >
        <div class="text-center">
          <div class="text-2xl font-bold">
            {{ systemData[0] }}<span class="text-toned">%</span>
          </div>
          <div class="text-muted text-xs">
            CPU Load
          </div>
        </div>
      </DonutChart>

      <div class="space-y-3">
        <div
          v-for="item in items"
          :key="item.name"
          class="flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-3">
            <div
              class="size-2 rounded-full"
              :style="{ backgroundColor: item.color }"
            />
            <span class="text-muted">{{ item.name }}</span>
          </div>
          <span class="font-medium font-mono text-toned">{{ item.value }}%</span>
        </div>
      </div>
    </div>
  </UCard>
</template>
