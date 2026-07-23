<script setup lang="ts">
const props = defineProps<{
  color?: string
}>()
</script>

<template>
  <div class="inline-flex h-8 w-8 animate-spin rounded-full">
    <div
      class="h-full w-full rounded-full border-4 border-transparent border-t-current"
      :class="props.color || 'text-(--ui-primary)'"
    />
  </div>
</template>
