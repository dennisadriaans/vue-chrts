<script setup lang="ts">
import type { ProgressCircleProps } from './types'

const { size = 50, strokeWidth = 5, showLabel = true, value, textSize, duration = 500 } = defineProps<ProgressCircleProps>()

const textSizeStyle = computed(() => {
  if (!textSize) return undefined
  return { fontSize: textSize }
})

const getProgressColor = (value: number): string => {
  if (value >= 75) return 'stroke-emerald-500 dark:stroke-emerald-400'
  if (value > 50) return 'stroke-amber-500 dark:stroke-amber-400'
  return 'stroke-rose-500 dark:stroke-rose-400'
}

const actualSize = computed(() => size)
const actualStrokeWidth = computed(() => strokeWidth)
const radius = computed(() => actualSize.value / 2 - actualStrokeWidth.value)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDasharray = computed(() =>
  `${(value / 100) * circumference.value} ${circumference.value}`
)
const center = computed(() => actualSize.value / 2)
</script>

<template>
  <div
    data-testid="progress-circle"
    class="relative"
    :style="{ width: `${actualSize}px`, height: `${actualSize}px` }"
  >
    <svg
      data-testid="progress-circle-svg"
      class="h-full w-full"
      :viewBox="`0 0 ${actualSize} ${actualSize}`"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="currentColor"
        :stroke-width="actualStrokeWidth"
        class="text-(--ui-bg-accented)"
      />

      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="currentColor"
        :stroke-width="actualStrokeWidth"
        :class="getProgressColor(value)"
        stroke-linecap="round"
        :stroke-dasharray="strokeDasharray"
        :transform="`rotate(-90 ${center} ${center})`"
        class="transition-all ease-out"
        :style="{ transitionDuration: `${duration}ms` }"
      />
      <text
        data-testid="progress-circle-value"
        :x="center"
        :y="center"
        text-anchor="middle"
        dominant-baseline="central"
        class="font-bold"
        :class="[textColor ?? 'fill-gray-700 dark:fill-gray-200', { 'text-xs': !textSize }]"
        :style="textSizeStyle"
      >
        {{ value }}%
      </text>
    </svg>
  </div>
</template>
