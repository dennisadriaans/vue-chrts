<script setup lang="ts">
interface Props {
  fig: string
  title: string
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="group flex h-full flex-col">
    <div class=" flex min-h-64 flex-1 items-center justify-center sm:min-h-72">
      <slot />
    </div>

    <div class="space-y-2 p-8 pt-0">
      <h2 class="text-default text-base font-medium tracking-tight">
        {{ title }}
      </h2>
      <p class="text-muted dark:text-dimmed text-sm leading-relaxed">
        {{ text }}
      </p>

      <NuxtLink :to="`/blocks/${title.toLowerCase().replace(/ /g, '-')}`" class="text-primary flex items-center gap-2 text-sm mt-8">Explore {{ title }} <UIcon name="i-lucide-arrow-right"></UIcon></NuxtLink>
    </div>
  </div>
</template>
