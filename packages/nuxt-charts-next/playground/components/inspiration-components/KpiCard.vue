<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    value: string;
    change: string;
    sublabel: string;
    icon: "pulse" | "target" | "basket";
    dark?: boolean;
    class?: string;
  }>(),
  {
    dark: false,
  },
);
</script>

<template>
  <InspirationComponentsCard :dark="dark" :class="['flex h-[178px] flex-col justify-between px-[18px] py-[18px]', $props.class]">
    <InspirationComponentsIconBadge :icon="icon" class="size-9 rounded-[12px]" />
    <div>
      <p :class="['text-[13px] font-semibold leading-none', dark ? 'text-white/85' : 'text-[#2e3140]']">{{ title }}</p>
      <p class="mt-3 text-[28px] font-extrabold leading-none tracking-[0]">{{ value }}</p>
      <p class="mt-5 text-[13px] font-bold text-[#bdf000]">{{ change }}</p>
      <p :class="['mt-1 text-[13px] leading-none', dark ? 'text-white/70' : 'text-[#7b7e86]']">{{ sublabel }}</p>
    </div>
  </InspirationComponentsCard>
</template>
