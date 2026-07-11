<script setup lang="ts">
interface Props {
  fig: string
  title: string
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="group flex h-full flex-col px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
    <span class="text-dimmed mb-8 font-mono text-[11px] tracking-wide uppercase">
      {{ fig }}
    </span>

    <div class="mb-10 flex min-h-40 flex-1 items-center justify-center sm:min-h-44">
      <slot />
    </div>

    <div class="space-y-2">
      <h2 class="text-default text-base font-medium tracking-tight">
        {{ title }}
      </h2>
      <p class="text-muted text-sm leading-relaxed">
        {{ text }}
      </p>
    </div>
  </div>
</template>
