<script setup lang="ts">
import OnboardingSummary from './OnboardingSummary.vue'
import type { Question } from './types'

defineOptions({
  tags: ['application', 'onboardingfinished']
})

defineProps<{
  questions: Question[]
}>()
</script>

<template>
  <div class="relative min-h-125 flex items-center justify-center">
    <div class="relative z-10 text-center space-y-8 pb-6">
      <div class="flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div class="relative bg-primary/10 rounded-full p-4 flex items-center justify-center">
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5 text-primary animate-scale-in"
            />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-3xl font-bold">
          All Set!
        </h2>
        <p class="text-dimmed text-lg max-w-md mx-auto">
          We've personalized your experience based on your preferences
        </p>
      </div>

      <OnboardingSummary :questions="questions" />
    </div>
  </div>
</template>
