<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <InspirationComponentsCard dark :class="['overflow-hidden px-7 py-6', $props.class]">
    <div class="absolute -right-4 -top-20 size-44 rounded-full border border-white/10" />
    <div class="absolute -right-9 -top-24 size-56 rounded-full border border-white/10" />
    <div class="absolute -right-14 -top-28 size-[17rem] rounded-full border border-white/10" />
    <div class="relative flex items-start justify-between">
      <h2 class="text-[13px] font-semibold text-white/80">Budget Spent</h2>
      <span class="text-lg leading-none text-white/80">...</span>
    </div>
    <p class="relative mt-3 text-[31px] font-extrabold">$72,650</p>
    <p class="relative mt-4 text-[13px] text-white/75">of $100,000</p>
    <div class="relative mt-4 flex items-center gap-5">
      <div class="h-3 flex-1 rounded-full bg-white/10">
        <div class="h-full w-[72%] rounded-full bg-[#c9f31d]" />
      </div>
      <strong class="text-[14px]">72%</strong>
    </div>
  </InspirationComponentsCard>
</template>
