<script setup lang="ts">
import type { QuestionOption } from './types'

defineOptions({
  tags: ['application', 'selectsearch']
})

const modelValue = defineModel<QuestionOption>()

defineProps<{
  options: QuestionOption[]
}>()
</script>

<template>
  <div class="flex items-center justify-center">
    <USelectMenu
      v-model="modelValue"
      placeholder="Select"
      :items="options"
      size="lg"
      class="w-56 rounded-full"
      :content="{
        align: 'center',
        side: 'bottom',
        sideOffset: 8
      }"
    />
  </div>
</template>
