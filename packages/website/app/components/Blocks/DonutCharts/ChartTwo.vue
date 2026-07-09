<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
  tags: ['donutcharts', 'customer-segments']
})

const segments = [
  { id: 'premium', name: 'Premium', value: 9450, percentage: 32, color: '#f97316', chartValue: 25 },
  { id: 'regular', name: 'Regular', value: 8320, percentage: 46, color: '#eab308', chartValue: 40 },
  { id: 'new', name: 'New', value: 3280, percentage: 20, color: '#14b8a6', chartValue: 20 },
  { id: 'other', name: 'Other', value: 0, percentage: 0, color: 'var(--ui-border)', chartValue: 15 }
]

const categories = computed(() => {
  return Object.fromEntries(
    segments.map(s => [
      s.id,
      {
        name: s.name,
        color: s.color
      }
    ])
  )
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="p-4">
    <UCard class="bg-default! mx-auto max-w-xl shadow-sm ring-1 ring-muted/50 border-none">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-medium text-highlighted">
              Customer Segments
            </h3>
            <UIcon
              name="i-lucide-info"
              class="text-muted size-4"
            />
          </div>
          <div class="text-sm">
            <span class="text-success font-medium">+5.8%</span> <span class="">vs last week</span>
          </div>
        </div>
      </template>

      <div class="flex items-center gap-4 py-2 px-4">
        <div class="relative w-5/12">
          <DonutChart
            :data="segments.map(s => s.chartValue)"
            :categories="categories"
            :arc-width="16"
            :pad-angle="0.02"
            :radius="0"
            :height="200"
            :hide-legend="true"
          />
        </div>

        <div class="space-y-2 w-7/12 px-4">
          <div
            v-for="segment in segments.filter(s => s.id !== 'other')"
            :key="segment.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-2.5 rounded-full"
                :style="{ backgroundColor: segment.color }"
              />
              <span class="font-medium text-toned">{{ segment.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-highlighted">{{ formatCurrency(segment.value) }}</span>
              <span class="text-muted">·</span>
              <span class="text-muted">{{ segment.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
