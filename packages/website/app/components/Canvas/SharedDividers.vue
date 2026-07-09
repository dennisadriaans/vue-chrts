<template>
  <div
    v-for="divider in dividers"
    :key="divider.id"
    class="absolute z-40 group/divider flex items-center justify-center p-2"
    :class="
      divider.type === 'vertical'
        ? 'cursor-e-resize -translate-x-1/2'
        : 'cursor-s-resize -translate-y-1/2'
    "
    :style="
      divider.type === 'vertical'
        ? {
          left: `${divider.pos}px`,
          top: `${divider.start}px`,
          height: `${divider.end - divider.start}px`,
          width: '16px'
        }
        : {
          top: `${divider.pos}px`,
          left: `${divider.start}px`,
          width: `${divider.end - divider.start}px`,
          height: '16px'
        }
    "
    @mousedown.stop="(e) => $emit('startResize', e, divider)"
  >
    <div
      class="bg-white/0 group-hover/divider:bg-white/20 transition-colors rounded-full"
      :class="divider.type === 'vertical' ? 'w-1 h-full' : 'h-1 w-full'"
    />
  </div>
</template>

<script setup lang="ts">
import type { SharedDivider } from './types'

defineProps<{
  dividers: SharedDivider[]
}>()

defineEmits<{
  (e: 'startResize', event: MouseEvent, divider: SharedDivider): void
}>()
</script>
