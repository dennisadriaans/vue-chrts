<script setup lang="ts">
defineOptions({
  tags: ['application', 'onboardingfooter']
})

defineProps<{
  isLastQuestion: boolean
}>()

const emit = defineEmits<{
  (event: 'next' | 'finish'): void
}>()
</script>

<template>
  <div class="mt-24 text-right">
    <UButton
      v-if="!isLastQuestion"
      label="Next"
      trailing-icon="i-lucide-chevron-right"
      @click="emit('next')"
    />
    <UButton
      v-else
      label="Get started"
      @click="emit('finish')"
    />
  </div>
</template>
