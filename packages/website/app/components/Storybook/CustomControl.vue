<script setup lang="ts">
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between px-8 py-4">
    <div>
      <p class="font-medium w-48">
        {{ label }}
      </p>
      <p
        v-if="description"
        class="text-sm text-dimmed"
      >
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
