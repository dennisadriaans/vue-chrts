<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? 'i-lucide-moon-star' : 'i-lucide-sun'"
      color="neutral"
      size="xs"
      variant="ghost"
      v-bind="$attrs"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="h-6 w-6" />
    </template>
  </ClientOnly>
</template>
