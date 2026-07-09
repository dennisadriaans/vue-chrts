<script setup lang="ts">
interface Props {
  icon: string
  title: string
  text: string
  linkText: string
  linkIcon: string
}
defineProps<Props>()
</script>

<template>
  <div
    class="group hover:shadow-primary/5 ring-default hover:border-primary/15 dark:bg-elevated/30 space-y-4 rounded-xl bg-white p-2 p-8 ring transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
  >
    <ClientOnly> <slot /> </ClientOnly>

    <UIcon
      :name="icon"
      class="text-primary mr-2 size-6"
    />

    <h2 class="text-highlighted text-2xl font-semibold">
      {{ title }}
    </h2>
    <p class="text-toned dark:text-muted mt-4 max-w-sm">
      {{ text }}
    </p>

    <span
      class="text-primary group-hover:text-primary text-sm lg:text-md mt-8 flex items-center gap-2 font-semibold transition duration-600"
    >
      <span>{{ linkText }}</span>
      <UIcon
        :name="linkIcon"
        size="16"
      />
    </span>
  </div>
</template>
