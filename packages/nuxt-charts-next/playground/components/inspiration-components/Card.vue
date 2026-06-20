<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    dark?: boolean;
    class?: string;
  }>(),
  {
    dark: false,
  },
);

const toneClass = computed(() =>
  props.dark
    ? "bg-[#242424] text-white shadow-[0_22px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.08)]"
    : "bg-white text-[#272a37] shadow-[0_18px_38px_rgba(28,26,20,0.09),inset_0_1px_0_rgba(255,255,255,0.72)]",
);
</script>

<template>
  <div :class="['rounded-[18px] p-5', toneClass, $props.class]">
    <slot />
  </div>
</template>
