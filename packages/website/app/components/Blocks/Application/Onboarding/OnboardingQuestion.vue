<script setup lang="ts">
import type { Question } from './types'

defineOptions({
  tags: ['application', 'onboardingquestion']
})

defineProps<{
  question: Question
}>()
</script>

<template>
  <div class="text-center space-y-2 p-6 my-6">
    <h2 class="text-2xl font-semibold">
      {{ question.title }}
    </h2>
    <p class="text-dimmed text-xl">
      {{ question.description }}
    </p>
  </div>
</template>
