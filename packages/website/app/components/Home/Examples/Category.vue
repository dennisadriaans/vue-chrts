<script setup lang="ts">
import type { CategoryDistributionCategoryItem } from '../../lib/CategoryDistribution/types'

const dataSets = [
  {
    primaryValue: '$9,450',
    categories: [
      { label: 'Marketing', percentage: 30, color: 'var(--color-indigo-500)', value: 3000 },
      { label: 'Sales', percentage: 20, color: 'var(--color-cyan-400)', value: 2000 },
      { label: 'Development', percentage: 15, color: 'var(--color-emerald-500)', value: 1500 },
      { label: 'Support', percentage: 35, color: '#ef4444', value: 3500 }
    ],
    trend: { value: '+8.2%', direction: 'up' as const }
  },
  {
    primaryValue: '$12,800',
    categories: [
      { label: 'Marketing', percentage: 50, color: 'var(--color-indigo-500)', value: 5000 },
      { label: 'Sales', percentage: 10, color: 'var(--color-cyan-400)', value: 1000 },
      { label: 'Development', percentage: 25, color: 'var(--color-emerald-500)', value: 2500 },
      { label: 'Support', percentage: 15, color: '#ef4444', value: 1500 }
    ],
    trend: { value: '+12.4%', direction: 'up' as const }
  },
  {
    primaryValue: '$10,200',
    categories: [
      { label: 'Marketing', percentage: 20, color: 'var(--color-indigo-500)', value: 2000 },
      { label: 'Sales', percentage: 45, color: 'var(--color-cyan-400)', value: 4500 },
      { label: 'Development', percentage: 10, color: 'var(--color-emerald-500)', value: 1000 },
      { label: 'Support', percentage: 25, color: '#ef4444', value: 2500 }
    ],
    trend: { value: '-2.1%', direction: 'down' as const }
  }
]

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  setTimeout(() => {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % dataSets.length
    }, 6000)
  }, 2000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const currentData = computed(() => dataSets[currentIndex.value])

// Tooltip logic
const tooltip = ref<{
  x: number
  y: number
  label: string
  value?: number | string
  color: string
}>()

function showTooltip(
  event: MouseEvent,
  category: CategoryDistributionCategoryItem
) {
  tooltip.value = {
    x: event.clientX + 12,
    y: event.clientY + 12,
    label: category.label,
    value: category.value,
    color: category.color
  }
}

function hideTooltip() {
  tooltip.value = undefined
}

const getTrendClass = computed(() => {
  if (!currentData.value?.trend) return ''

  const baseClasses = 'text-sm'

  switch (currentData.value.trend.direction) {
    case 'up':
      return `${baseClasses} text-success`
    case 'down':
      return `${baseClasses} text-error`
    case 'neutral':
    default:
      return `${baseClasses} text-muted`
  }
})

const formatLegendLabel = (label: string): string | undefined => {
  return label.split(' ')[0]
}
</script>

<template>
  <UCard
    data-testid="category-distribution"
    class="border-default border bg-default w-full lg:mx-8"
  >
    <div class="space-y-2">
      <!-- Primary Value and Trend -->
      <div class="flex items-baseline gap-2">
        <span
          data-testid="category-distribution-value"
          class="text-default text-2xl font-bold"
        >
          <LibRollingNumber :value="currentData?.primaryValue" />
        </span>
        <span
          v-if="currentData?.trend"
          :class="getTrendClass"
          class="text-sm font-medium"
        >
          <LibRollingNumber
            :value="currentData.trend.value"
            :delay-digit="20"
          />
        </span>
      </div>

      <!-- Distribution Bar -->
      <div
        data-testid="category-distribution-bars"
        class="mb-4 flex h-2 w-full gap-2 overflow-hidden"
      >
        <div
          v-for="(category, index) in currentData?.categories ?? []"
          :key="`bar-${index}`"
          data-testid="category-distribution-bar"
          :style="{
            width: `${category.percentage}%`,
            backgroundColor: category.color
          }"
          class="rounded-full transition-all duration-1000"
          @mouseenter="(e) => showTooltip(e, category)"
          @mousemove="(e) => showTooltip(e, category)"
          @mouseleave="hideTooltip"
        />
      </div>

      <!-- Legend -->
      <div
        data-testid="category-distribution-legend"
        class="text-muted mt-4 relative flex flex-wrap gap-x-4 gap-y-2 text-sm"
      >
        <div
          v-for="(category, index) in currentData?.categories ?? []"
          :key="`legend-${index}`"
          data-testid="category-distribution-legend-item"
          class="flex cursor-pointer items-center gap-1.5"
        >
          <span
            class="h-2 w-2 rounded-full"
            :style="{ backgroundColor: category.color }"
          />
          <span class="flex items-center gap-1 whitespace-nowrap">
            <span>{{ formatLegendLabel(category.label) }}</span>
            <span class="text-sm text-default">
              {{ category.percentage }}
            </span>
          </span>
        </div>
        <!-- Tooltip -->
        <div
          v-if="tooltip"
          data-testid="category-distribution-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
          class="bg-default border-default text-default pointer-events-none fixed z-50 min-w-30 rounded border px-3 py-2 shadow"
        >
          <div class="font-medium">
            {{ tooltip.label }}
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex h-2 w-2 rounded-full"
              :style="{ backgroundColor: tooltip.color }"
            />
            <div
              v-if="tooltip.value !== undefined"
              class="text-muted"
            >
              {{ tooltip.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
