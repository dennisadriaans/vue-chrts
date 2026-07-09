<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const scrollPosition = computed(() => Math.round(y.value))
</script>

<template>
  <div class="hidden fixed bottom-4 right-4 z-[9999] pointer-events-none">
    <div class="bg-[var(--ui-bg-elevated)] border border-[var(--ui-border)] px-3 py-1.5 rounded-lg shadow-xl font-mono text-xs text-[var(--ui-text-highlighted)] flex items-center gap-2 tabular-nums">
      <span class="text-[var(--ui-text-dimmed)]">SCROLL:</span>
      {{ scrollPosition }}px
    </div>
  </div>
</template>
