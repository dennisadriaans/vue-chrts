<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <InspirationComponentsCard :class="['px-5 py-6', $props.class]">
    <h2 class="text-[13px] font-semibold">Time Range</h2>
    <div class="mt-7 inline-flex overflow-hidden rounded-[11px] border border-[#ecece8] text-[12px] font-semibold">
      <button class="grid size-10 place-items-center bg-white">
        <InspirationComponentsIconBadge icon="calendar" class="size-6 rounded-none bg-transparent text-[#333642]" />
      </button>
      <button class="h-10 bg-[#c9f31d] px-5">7D</button>
      <button class="h-10 border-l border-[#ecece8] px-5">30D</button>
      <button class="h-10 border-l border-[#ecece8] px-5">90D</button>
      <button class="h-10 border-l border-[#ecece8] px-5">1Y</button>
    </div>
    <InspirationComponentsIconBadge icon="sliders" floating class="absolute -right-3 -top-5 size-[54px] rounded-[15px]" />
  </InspirationComponentsCard>
</template>
