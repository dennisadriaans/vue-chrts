<script setup lang="ts">
defineOptions({
  tags: ['donutcharts', 'visitors', 'dashboard']
})

const months = [
  {
    title: 'January 2019',
    total: '18,420',
    data: [
      { name: 'Google', value: 1.5, display: '1.5k', color: '#fb7185' },
      { name: 'Facebook', value: 1.8, display: '1.8k', color: '#2563eb' },
      { name: 'Twitter', value: 1.1, display: '1.1k', color: '#eab308' },
      { name: 'Email', value: 14.0, display: '14k', color: '#fb923c' }
    ]
  },
  {
    title: 'February 2019',
    total: '19,850',
    data: [
      { name: 'Google', value: 1.7, display: '1.7k', color: '#fb7185' },
      { name: 'Facebook', value: 1.9, display: '1.9k', color: '#2563eb' },
      { name: 'Twitter', value: 1.0, display: '1k', color: '#eab308' },
      { name: 'Email', value: 15.2, display: '15.2k', color: '#fb923c' }
    ]
  },
  {
    title: 'March 2019',
    total: '21,950',
    data: [
      { name: 'Google', value: 1.9, display: '1.9k', color: '#fb7185' },
      { name: 'Facebook', value: 2.0, display: '2k', color: '#2563eb' },
      { name: 'Twitter', value: 1.2, display: '1.2k', color: '#eab308' },
      { name: 'Email', value: 16.8, display: '15.9k', color: '#fb923c' }
    ]
  }
]

const currentMonthIndex = ref(2)
const currentMonth = computed(() => months[currentMonthIndex.value])

const prevMonth = () => {
  currentMonthIndex.value = (currentMonthIndex.value - 1 + months.length) % months.length
}

const nextMonth = () => {
  currentMonthIndex.value = (currentMonthIndex.value + 1) % months.length
}

const categories = computed(() => {
  return Object.fromEntries(
    currentMonth.value.data.map(item => [
      item.name,
      {
        name: item.name,
        color: item.color
      }
    ])
  )
})
</script>

<template>
  <div class="p-4">
    <UCard class="!bg-default mx-auto max-w-sm shadow-sm ring-1 ring-muted/50 border-none">
      <template #header>
        <div class="flex items-center justify-between">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-chevron-left"
            size="sm"
            @click="prevMonth"
          />
          <h3 class="text-sm font-bold text-highlighted uppercase tracking-tight">
            {{ currentMonth.title }}
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-chevron-right"
            size="sm"
            @click="nextMonth"
          />
        </div>
      </template>

      <div class="flex flex-col items-center gap-10 py-6">
        <div class="relative">
          <DonutChart
            :data="currentMonth.data.map(d => d.value)"
            :categories="categories"
            :height="220"
            :arc-width="16"
            :pad-angle="0.02"
            :radius="0"
            :hide-legend="true"
          >
            <div class="flex flex-col items-center justify-center">
              <span class="text-4xl font-bold text-highlighted tracking-tight">{{ currentMonth.total }}</span>
              <span class="text-sm text-dimmed mt-1 font-medium">visitors this month</span>
            </div>
          </DonutChart>
        </div>

        <div class="grid grid-cols-2 gap-x-12 gap-y-6 w-full px-4">
          <div
            v-for="item in currentMonth.data"
            :key="item.name"
            class="flex items-center gap-2 group cursor-default"
          >
            <div
              class="size-3 rounded-full shrink-0"
              :style="{ backgroundColor: item.color }"
            />
            <div class="flex items-center justify-between flex-1">
              <span class="text-sm text-dimmed font-medium">{{ item.name }}</span>
              <span class="text-sm font-bold text-highlighted ml-1">{{ item.display }}</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
