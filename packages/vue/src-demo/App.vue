<script lang="ts" setup>
import { computed } from "vue";

import { useColorMode } from "@vueuse/core";
useColorMode();

const displayCopyright = computed(() => {
  const currentYear = new Date().getFullYear();
  return `Made with 💚 ~ ©&nbsp;${currentYear}&nbsp;Dennis Adriaansen, Inc. All rights reserved.`;
});
</script>

<template>
  <div>
    <RouterView />
    <div class="border-t border-border mt-8">
      <div class="max-w-7xl mx-auto py-8 flex items-center justify-between">
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
