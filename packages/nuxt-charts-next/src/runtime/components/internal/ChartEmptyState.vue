<script setup lang="ts">
defineProps<{ height: number; message?: string }>();
</script>

<template>
  <div class="vc-empty-state" :style="{ height: `${height}px` }" role="status">
    {{ message ?? "No valid data" }}
  </div>
</template>
