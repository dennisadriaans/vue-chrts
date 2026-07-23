<script lang="ts" setup>
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="space-y-1">
    <AuthButton
      :label="label ? label : `Github`"
      icon="i-mdi-github"
      provider="github"
    />
  </div>
</template>
