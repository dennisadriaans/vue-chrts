<template>
  <div>
    <CanvasBoard />
    <div class="fixed bottom-6 right-6 z-50">
      <UButton
        to="/charts"
        label="View Charts Sources"
        variant="soft"
        color="primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
