<script lang="ts" setup>
import { computed } from "vue";

import Logo from "./elements/Logo.vue";

import { useColorMode } from "@vueuse/core";
useColorMode();

const mainMenuLinks = [
  {
    to: "/",
    label: "Blocks",
  },
  {
    to: "/charts",
    label: "Charts",
  },
  {
    to: "/docs",
    label: "Docs",
  },
];

const displayCopyright = computed(() => {
  const currentYear = new Date().getFullYear();
  return `Made with 💚 ~ ©&nbsp;${currentYear}&nbsp;Dennis Adriaansen, Inc. All rights reserved.`;
});
</script>

<template>
  <div>
    <div
      class="w-full flex  mx-auto py-4 bg-neutral-950 border-b border-neutral-800"
    >
      <div class="flex items-center justify-start max-w-screen-2xl mx-auto w-full">
        <NuxtLink to="/">
          <Logo />
        </NuxtLink>

        <div class="flex items-center gap-2 lg:gap-8 ml-8">
          <div class="hidden items-center justify-between gap-6 lg:flex">
            <template v-for="(item, itemKey) in mainMenuLinks" :key="itemKey">
              <NuxtLink :to="item.to" class="relative">
                <div
                  class="w-2 h-2 bg-primary rounded-full absolute top-0 right-0 -mt-0.5 -mr-2"
                  v-if="itemKey === 0"
                ></div>
                <UButton
                  variant="ghost"
                  color="neutral"
                  class="text-neutral-400 font-semibold text-sm"
                  :class="itemKey === 0 ? '!text-neutral-300' : ''"
                  >{{ item.label }}</UButton
                >
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>

    <RouterView />
    <div class="border-t border-border mt-8">
      <div class="max-w-screen-2xl mx-auto py-8 flex items-center justify-between">
        <div v-html="displayCopyright"></div>
        <div>
          <a href="https://x.com/DennisAdriaans" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="30px"
              height="30px"
            >
              <path
                fill="currentColor"
                d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
