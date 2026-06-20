<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: "pulse" | "target" | "basket" | "bars" | "wallet" | "trend" | "users" | "calendar" | "sliders";
    floating?: boolean;
    class?: string;
  }>(),
  {
    floating: false,
  },
);
</script>

<template>
  <span
    :class="[
      'inline-flex size-10 items-center justify-center rounded-[13px] bg-[#c9f31d] text-[#202319]',
      floating ? 'shadow-[0_16px_30px_rgba(130,150,20,0.26)]' : '',
      $props.class,
    ]"
  >
    <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path v-if="icon === 'pulse'" d="M3 13h4l2-7 4 12 2-5h6" stroke-width="2.2" />
      <g v-else-if="icon === 'target'" stroke-width="2">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
        <path d="m8 5 2 3M16 5l-2 3" />
      </g>
      <g v-else-if="icon === 'basket'" stroke-width="2">
        <path d="M6 10h12l-1.2 8H7.2L6 10Z" />
        <path d="m9 10 3-5 3 5" />
      </g>
      <g v-else-if="icon === 'bars'" stroke-width="2.2">
        <path d="M6 19V11" />
        <path d="M12 19V7" />
        <path d="M18 19V4" />
      </g>
      <g v-else-if="icon === 'wallet'" stroke-width="2">
        <path d="M4 8.5h14.5a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2H17" />
        <path d="M15 14h5.5" />
        <circle cx="16.8" cy="14" r="1" fill="currentColor" stroke="none" />
      </g>
      <g v-else-if="icon === 'trend'" stroke-width="2.2">
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </g>
      <g v-else-if="icon === 'users'" stroke-width="1.9">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 18c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" />
        <path d="M15 6.5a2.5 2.5 0 0 1 0 5M15.8 14c2 .4 3.6 1.8 4.2 4" />
      </g>
      <g v-else-if="icon === 'calendar'" stroke-width="1.9">
        <path d="M7 4v3M17 4v3M4.5 9h15" />
        <rect x="4.5" y="6" width="15" height="14" rx="2.5" />
      </g>
      <g v-else stroke-width="2">
        <path d="M4 7h10M18 7h2M4 12h3M11 12h9M4 17h12M20 17h0" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="9" cy="12" r="2" />
        <circle cx="18" cy="17" r="2" />
      </g>
    </svg>
  </span>
</template>
