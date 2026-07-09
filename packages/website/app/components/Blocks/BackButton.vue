<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'backbutton']
})
</script>

<template>
  <div class="max-w-6px mx-auto">
    <NuxtLink to="/blocks">
      <UButton
        color="neutral"
        class="-ml-2"
        variant="ghost"
        icon="i-lucide-chevron-left"
      >
        <span>Back to blocks</span>
      </UButton>
    </NuxtLink>
  </div>
</template>
