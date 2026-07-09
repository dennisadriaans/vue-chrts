<script setup lang="ts">
const model = defineModel<string>({ required: true })

interface TabItem {
  label: string
  value: string
  icon?: string
}

defineProps<{
  label: string
  description?: string
  items: TabItem[]
}>()
</script>

<template>
  <StorybookCustomControl
    :label="label"
    :description="description"
  >
    <UTabs
      v-model="model"
      :items="items"
      :content="false"
      color="neutral"
    />
  </StorybookCustomControl>
</template>
