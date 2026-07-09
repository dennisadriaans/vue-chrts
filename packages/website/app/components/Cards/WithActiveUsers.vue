<script lang="ts" setup>
defineProps<{
  current: number | string
  previous: number | string
  percentChange: number | string
  increasing: boolean
}>()
</script>

<template>
  <UCard class="!bg-default">
    <div class="space-y-4">
      <!-- Current Value with Context -->
      <div class="space-y-1">
        <div class="text-2xl font-semibold">
          {{ current }}
        </div>
        <div class="text-muted text-sm">
          from {{ previous }} previous
        </div>
      </div>

      <!-- Change Indicator -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <UIcon
            :name="increasing ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
            :class="increasing ? 'text-success-600' : 'text-warning-600'"
            class="h-4 w-4"
          />
          <span
            :class="increasing ? 'text-success-600' : 'text-warning-600'"
            class="font-medium"
          >
            {{ percentChange }}%
          </span>
        </div>
        <span class="text-muted text-sm"> vs. last month </span>
      </div>
    </div>
  </UCard>
</template>
