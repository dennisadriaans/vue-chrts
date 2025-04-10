<script lang="ts" setup>
const props = defineProps<{
  color?: string
}>();
</script>
<template>
  <button
  :class="props.color === 'white' ? 'bg-white hover:bg-white/75' : 'bg-primary hover:bg-primary/75'"
    class="rounded font-medium inline-flex items-center focus:outline-hidden disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-background disabled:bg-(--ui-primary) aria-disabled:bg-(--ui-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary)"
  >
    <slot></slot>
  </button>
</template>
