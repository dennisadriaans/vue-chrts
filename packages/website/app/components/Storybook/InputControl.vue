<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  label: string
  description?: string
  placeholder?: string
  inputClass?: string
}>()
</script>

<template>
  <StorybookCustomControl
    :label="label"
    :description="description"
  >
    <UInput
      v-model="model"
      :placeholder="placeholder"
      :class="inputClass ?? 'w-32'"
    />
  </StorybookCustomControl>
</template>
