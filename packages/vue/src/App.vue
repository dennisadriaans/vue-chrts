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
    <RouterView />
</template>
