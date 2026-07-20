<script setup lang="ts">
const isThoughtExpanded = ref(false)
</script>

<template>
  <div class="max-h-48 overflow-hidden rounded-xl border border-default bg-default">
    <div class="flex items-center justify-between border-b border-default px-3 py-2">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <UIcon
          name="i-heroicons-sparkles"
          class="size-4"
        />
        Nuxt Charts AI
      </div>
      <div class="flex items-center gap-0.5">
        <UButton
          icon="i-heroicons-star"
          color="neutral"
          variant="ghost"
          size="xs"
        />
        <UButton
          icon="i-heroicons-plus"
          color="neutral"
          variant="ghost"
          size="xs"
        />
      </div>
    </div>

    <div class="space-y-3 p-3 text-xs">
      <div class="flex justify-end">
        <div class="max-w-[90%] rounded-2xl bg-elevated px-3 py-2">
          Create personalized email draft to David
        </div>
      </div>

      <button
        class="flex w-full items-center justify-between rounded-lg p-1.5 text-left transition-colors hover:bg-elevated"
        @click="isThoughtExpanded = !isThoughtExpanded"
      >
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-light-bulb"
            class="size-3.5"
          />
          <span>Thought for 4 seconds</span>
        </div>
        <UIcon
          name="i-heroicons-chevron-right"
          class="size-3.5 transition-transform duration-200"
          :class="{ 'rotate-90': isThoughtExpanded }"
        />
      </button>

      <div
        v-if="isThoughtExpanded"
        class="border-l-2 border-default py-1 pl-4 text-muted leading-relaxed"
      >
        Analyzing the request for a personalized email draft to David...
      </div>

      <p class="leading-relaxed">
        Got it! I'll draft a personalized email for David so you can maximize sales.
      </p>

      <div class="rounded-xl bg-elevated/60 p-3">
        <p class="mb-2 font-medium">
          Quick idea for you
        </p>
        <p class="text-muted">
          Hi David, I have a few ideas to improve your product's first-time user experience...
        </p>
      </div>
    </div>
  </div>
</template>
