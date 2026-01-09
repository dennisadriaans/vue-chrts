<script setup lang="ts">
defineProps<{
  showReset?: boolean
}>()

const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
  reset: []
}>()
</script>

<template>
  <div class="flex gap-2">
    <UButton
      icon="i-lucide-plus"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Zoom in"
      @click="emit('zoomIn')"
    />
    <UButton
      icon="i-lucide-minus"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Zoom out"
      @click="emit('zoomOut')"
    />
    <UButton
      v-if="showReset !== false"
      icon="i-lucide-refresh-cw"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Reset view"
      @click="emit('reset')"
    />
  </div>
</template>
