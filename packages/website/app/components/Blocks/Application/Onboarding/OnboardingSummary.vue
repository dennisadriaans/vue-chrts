<script setup lang="ts">
import type { Question } from './types'

defineOptions({
  tags: ['application', 'onboardingsummary']
})

defineProps<{
  questions: Question[]
}>()
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-2">
    <div
      v-for="(question, index) in questions"
      :key="index"
      class="bg-primary/5 border border-primary/10 rounded-lg p-2 text-left transition-all hover:border-primary/20 animate-slide-in"
      :style="{ animationDelay: `${index * 100}ms` }"
    >
      <div class="flex items-start gap-4">
        <div class="w-full text-center text-sm">
          <h3 class="font-semibold">
            {{ question.title }}
          </h3>
          <p class="text-primary font-medium">
            {{ question.value?.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
