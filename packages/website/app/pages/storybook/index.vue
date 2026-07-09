<script setup lang="ts">
definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
    <div class="text-center">
      <UIcon
        name="i-lucide-component"
        class="mx-auto mb-4 size-12 text-muted"
      />
      <h2 class="text-xl font-semibold text-highlighted">
        Select a Component
      </h2>
      <p class="mt-2 text-sm text-muted">
        Choose a component from the sidebar to get started
      </p>
    </div>
  </div>
</template>
