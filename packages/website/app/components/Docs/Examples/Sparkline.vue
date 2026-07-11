<script setup lang="ts">
import Sparkline from '~/components/lib/Sparkline/Sparkline.vue'

const revenue = [12, 18, 15, 22, 19, 28, 26, 34, 30, 38, 44, 41]
const traffic = [40, 38, 42, 35, 30, 33, 28, 31, 26, 24, 27, 22]
const orders = [8, 12, 9, 14, 11, 16, 13, 18, 15, 20, 17, 24]

const rows = [
  { label: 'Revenue', value: '$41.2k', data: revenue, color: 'var(--ui-success)', type: 'area' as const },
  { label: 'Sessions', value: '22.4k', data: traffic, color: 'var(--ui-error)', type: 'line' as const },
  { label: 'Orders', value: '1,240', data: orders, color: 'var(--ui-primary)', type: 'bar' as const }
]
</script>

<template>
  <UCard class="w-full">
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
        <Sparkline
          :data="row.data"
          :type="row.type"
          :color="row.color"
          :width="140"
          :height="40"
          show-last-point
        />
      </div>
    </div>
  </UCard>
</template>
