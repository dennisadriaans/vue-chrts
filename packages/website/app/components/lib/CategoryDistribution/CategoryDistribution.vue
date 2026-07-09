<script setup lang="ts">
import type {
  CategoryDistributionProps,
  CategoryDistributionCategoryItem
} from './types'

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

const { legendClass = '', showFullLabel = false, gap = 'sm', trend, categories, title } = defineProps<CategoryDistributionProps>()

const gapClass = computed(() => {
  switch (gap) {
    case 'sm':
      return 'gap-1'
    case 'lg':
      return 'gap-2'
    case 'xl':
      return 'gap-4'
    default:
      return 'gap-1'
  }
})

const getTrendClass = computed(() => {
  if (!trend) return ''

  const baseClasses = 'text-sm'

  switch (trend.direction) {
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
    class="border-default border"
  >
    <div class="space-y-2">
      <!-- Primary Value and Trend -->
      <div class="flex items-baseline gap-2">
        <span
          data-testid="category-distribution-value"
          class="text-default text-2xl font-bold"
        >{{ primaryValue }}</span>
        <span
          v-if="trend"
          :class="getTrendClass"
          class="text-sm"
        >
          {{ trend.value }}
        </span>
      </div>

      <!-- Distribution Bar -->
      <div
        data-testid="category-distribution-bars"
        class="mb-4 flex h-2 w-full overflow-hidden"
        :class="gapClass"
      >
        <div
          v-for="(category, index) in categories"
          :key="`bar-${index}`"
          data-testid="category-distribution-bar"
          :style="{
            width: `${category.percentage}%`,
            backgroundColor: category.color
          }"
          class="rounded-full transition-all duration-300"
          @mouseenter="(e) => showTooltip(e, category)"
          @mousemove="(e) => showTooltip(e, category)"
          @mouseleave="hideTooltip"
        />
      </div>

      <!-- Legend -->
      <div
        data-testid="category-distribution-legend"
        :class="legendClass"
        class="text-muted relative flex gap-4 text-sm"
      >
        <div
          v-for="(category, index) in categories"
          :key="`legend-${index}`"
          data-testid="category-distribution-legend-item"
          class="flex cursor-pointer items-center gap-1.5"
        >
          <span
            class="h-2 w-2 rounded-full"
            :style="{ backgroundColor: category.color }"
          />
          <span class="whitespace-nowrap">
            {{ formatLegendLabel(category.label) }}
          </span>
        </div>
        <!-- Tooltip -->
        <div
          v-if="tooltip"
          data-testid="category-distribution-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
          class="bg-default border-default text-default pointer-events-none fixed z-50 min-w-[120px] rounded border px-3 py-2 shadow"
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
