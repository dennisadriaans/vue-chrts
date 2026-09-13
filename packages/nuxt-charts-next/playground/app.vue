<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (value) => {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <UApp>
    <ClientOnly>
      <UButton
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        aria-label="Toggle color mode"
        class="fixed top-3 right-3 z-50"
        @click="isDark = !isDark"
      />
      <template #fallback>
        <div class="fixed top-3 right-3 z-50 size-8" />
      </template>
    </ClientOnly>
    <NuxtPage />
  </UApp>
</template>
