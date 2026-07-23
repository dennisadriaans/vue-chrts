<template>
  <template
    v-for="(line, index) in lines"
    :key="index"
  >
    <div
      v-if="line.type === 'x'"
      class="absolute top-0 bottom-0 w-px bg-white/20 pointer-events-none z-10"
      :style="{ left: `${line.pos}px` }"
    />
    <div
      v-else
      class="absolute left-0 right-0 h-px bg-white/20 pointer-events-none z-10"
      :style="{ top: `${line.pos}px` }"
    />
  </template>
</template>

<script setup lang="ts">
import type { AlignmentLine } from './types'

defineProps<{
  lines: AlignmentLine[]
}>()
</script>
