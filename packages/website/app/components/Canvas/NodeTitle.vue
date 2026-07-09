<script lang="ts" setup>
const { title, description } = defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold">
      {{ title }}
    </h2>
    <p class="text-dimmed text-sm mt-1">
      {{ description }}
    </p>
  </div>
</template>
