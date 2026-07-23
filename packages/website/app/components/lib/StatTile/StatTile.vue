<script setup lang="ts">
import type { StatTileProps } from './types'
import Sparkline from '../Sparkline/Sparkline.vue'
import RollingNumber from '../RollingNumber.vue'

const {
  label,
  value,
  prefix,
  suffix,
  trend,
  caption,
  icon,
  sparkline,
  sparklineType = 'area',
  color,
  animate = false
} = defineProps<StatTileProps>()

const trendClass = computed(() => {
  switch (trend?.direction) {
    case 'up':
      return 'text-success'
    case 'down':
      return 'text-error'
    default:
      return 'text-muted'
  }
})

const trendIcon = computed(() => {
  switch (trend?.direction) {
    case 'up':
      return 'i-lucide-trending-up'
    case 'down':
      return 'i-lucide-trending-down'
    default:
      return 'i-lucide-minus'
  }
})

const sparklineColor = computed(() => {
  if (color) return color
  switch (trend?.direction) {
    case 'up':
      return 'var(--ui-success)'
    case 'down':
      return 'var(--ui-error)'
    default:
      return 'var(--ui-primary)'
  }
})
</script>

<template>
  <UCard
    data-testid="stat-tile"
    class="border-default border"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 space-y-1">
        <div class="text-muted flex items-center gap-1.5 text-sm">
          <UIcon
            v-if="icon"
            :name="icon"
            class="size-4 shrink-0"
          />
          <span class="truncate">{{ label }}</span>
        </div>

        <div
          data-testid="stat-tile-value"
          class="text-highlighted flex items-baseline gap-0.5 text-2xl font-bold tabular-nums"
        >
          <span v-if="prefix">{{ prefix }}</span>
          <RollingNumber
            v-if="animate"
            :value="value"
          />
          <span v-else>{{ value }}</span>
          <span
            v-if="suffix"
            class="text-muted text-lg font-semibold"
          >{{ suffix }}</span>
        </div>

        <div
          v-if="trend || caption"
          class="flex items-center gap-1.5 text-sm"
        >
          <span
            v-if="trend"
            :class="trendClass"
            class="inline-flex items-center gap-0.5 font-medium"
          >
            <UIcon
              :name="trendIcon"
              class="size-3.5"
            />
            {{ trend.value }}
          </span>
          <span
            v-if="caption"
            class="text-dimmed"
          >{{ caption }}</span>
        </div>
      </div>

      <Sparkline
        v-if="sparkline?.length"
        :data="sparkline"
        :type="sparklineType"
        :color="sparklineColor"
        :width="96"
        :height="44"
        class="mt-1 shrink-0"
      />
    </div>
  </UCard>
</template>
