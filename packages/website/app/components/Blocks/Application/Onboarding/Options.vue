<script lang="ts" setup>
import type { QuestionOption } from './types'

defineOptions({
  tags: ['application', 'options']
})

const modelValue = defineModel<QuestionOption>()

defineProps<{
  options: QuestionOption[]
}>()

function selectOption(option: QuestionOption): void {
  modelValue.value = option
}

function isSelected(option: QuestionOption): boolean {
  return option.value === modelValue.value?.value
}
</script>

<template>
  <div
    class="max-w-xs mx-auto space-y-4"
  >
    <div
      v-for="option in options"
      :key="option.value"
      class="text-center ring rounded-full p-1 cursor-pointer select-none"
      :class="isSelected(option) ? 'ring-primary' : 'ring-(--ui-border)'"
      @click="selectOption(option)"
    >
      {{ option.label }}
    </div>
  </div>
</template>
