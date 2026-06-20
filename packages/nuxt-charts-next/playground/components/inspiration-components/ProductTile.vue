<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <InspirationComponentsCard :class="['px-5 py-6', $props.class]">
    <div class="grid h-full grid-cols-[1fr_82px] items-center gap-4">
      <div>
        <h2 class="text-[13px] font-semibold">Top Product</h2>
        <p class="mt-3 text-[13px] text-[#50535e]">Smart Watch X1</p>
        <p class="mt-2 text-[21px] font-extrabold">$12,540</p>
        <p class="mt-2 text-[13px] font-bold">+9.8% <span class="ml-2 font-normal text-[#858893]">vs last 7 days</span></p>
      </div>
      <div class="flex size-[82px] items-center justify-center rounded-[18px] bg-[#eeeeea]">
        <div class="relative h-14 w-9 rounded-[10px] bg-[#1f2020] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08)]">
          <div class="absolute -top-2 left-2.5 h-3 w-4 rounded-t bg-[#303030]" />
          <div class="absolute -bottom-2 left-2.5 h-3 w-4 rounded-b bg-[#303030]" />
          <div class="absolute left-2 top-4 h-5 w-5 rounded-full border border-white/35" />
          <div class="absolute left-[17px] top-[18px] h-3 w-px origin-bottom rotate-45 bg-white" />
          <div class="absolute left-[17px] top-[17px] h-2 w-px origin-bottom -rotate-45 bg-white" />
        </div>
      </div>
    </div>
  </InspirationComponentsCard>
</template>
