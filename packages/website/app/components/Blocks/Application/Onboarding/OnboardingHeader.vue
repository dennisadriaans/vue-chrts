<script setup lang="ts">
defineOptions({
  tags: ['application', 'onboardingheader']
})

const props = defineProps<{
  progressValue: number
  questionKey: number
  totalQuestions: number
  isFirstQuestion: boolean
}>()

const emit = defineEmits<{
  (event: 'previous'): void
}>()
</script>

<template>
  <div>
    <div class="relative">
      <UProgress
        :model-value="props.progressValue"
        class="top-0 left-0 right-0 absolute w-full"
      />
    </div>

    <div class="pt-3 flex items-center justify-between">
      <UButton
        color="neutral"
        variant="link"
        label="Previous"
        leading-icon="i-lucide-chevron-left"
        class="pl-0"
        :disabled="props.isFirstQuestion"
        @click="emit('previous')"
      />
      <div class="flex gap-px">
        <span class="font-bold">{{ props.questionKey }}</span>
        <span>/</span>
        <span>{{ props.totalQuestions }}</span>
      </div>
    </div>
  </div>
</template>
