<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <section
    :class="[
      'relative overflow-hidden rounded-[10px] bg-[#efeee9] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
      $props.class,
    ]"
  >
    <slot />
  </section>
</template>
