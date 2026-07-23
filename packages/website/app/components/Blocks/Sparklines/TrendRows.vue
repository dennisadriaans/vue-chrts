<script lang="ts" setup>
import Sparkline from '~/components/lib/Sparkline/Sparkline.vue'

defineOptions({
  tags: ['blocks', 'sparklines', 'trend-rows']
})

const rows = [
  { label: 'Revenue', value: '$41.2k', delta: '+12%', up: true, data: [12, 18, 15, 22, 19, 28, 26, 34, 30, 38, 44, 41], color: 'var(--ui-success)' },
  { label: 'Sessions', value: '22.4k', delta: '-4%', up: false, data: [40, 38, 42, 35, 30, 33, 28, 31, 26, 24, 27, 22], color: 'var(--ui-error)' },
  { label: 'Signups', value: '1,240', delta: '+8%', up: true, data: [8, 12, 9, 14, 11, 16, 13, 18, 15, 20, 17, 24], color: 'var(--ui-primary)' }
]
</script>

<template>
  <UCard class="mx-auto w-full max-w-md">
    <div class="divide-default divide-y">
      <div
        v-for="row in rows"
        :key="row.label"
        class="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0"
      >
        <div class="space-y-0.5">
          <div class="text-muted text-sm">
            {{ row.label }}
          </div>
          <div class="text-highlighted font-semibold tabular-nums">
            {{ row.value }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Sparkline
            :data="row.data"
            type="area"
            :color="row.color"
            :width="120"
            :height="36"
            show-last-point
          />
          <span
            class="text-sm font-medium"
            :class="row.up ? 'text-success' : 'text-error'"
          >{{ row.delta }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>
