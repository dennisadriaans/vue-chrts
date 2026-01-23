<script setup lang="ts">
import type { MapLegendItem } from './types'

defineProps<{
  items: MapLegendItem[]
}>()
</script>

<template>
  <div class="bg-default shadow-xl rounded-lg p-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center gap-4 justify-end"
      :class="{ 'mt-2': index > 0 }"
    >
      <div
        class="w-2 h-2 rounded-full"
        :style="{ backgroundColor: item.color }"
      />
      <span class="text-xs uppercase tracking-widest text-muted font-medium">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
