<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <StorybookCustomControl
    :label="label"
    :description="description"
  >
    <USwitch v-model="model" />
  </StorybookCustomControl>
</template>
