<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div>
    <!-- <div class="border-b border-default bg-default px-8 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold tracking-tight text-highlighted">
            {{ title }}
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-code-2"
          >
            View Code
          </UButton>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-copy"
          >
            Copy
          </UButton>
        </div>
      </div>
    </div> -->

    <div class="space-y-2 p-6">
      <slot />
    </div>
  </div>
</template>
