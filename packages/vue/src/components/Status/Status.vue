<script lang="ts" setup>
import { ref } from "vue";

interface StatusProps {
  domain: string;
  uptime: string;
  outages: Array<{ hour: number; status: "online" | "offline" }>;
}

const props = defineProps<StatusProps>();

const outages = ref([
  { hour: 0, status: "online" },
  { hour: 1, status: "online" },
  { hour: 2, status: "online" },
  { hour: 3, status: "online" },
  { hour: 4, status: "online" },
  { hour: 5, status: "online" },
  { hour: 6, status: "online" },
  { hour: 7, status: "online" },
  { hour: 8, status: "online" },
  { hour: 9, status: "online" },
  { hour: 10, status: "online" },
  { hour: 11, status: "offline" },
  { hour: 12, status: "online" },
  { hour: 13, status: "online" },
  { hour: 14, status: "online" },
  { hour: 15, status: "online" },
  { hour: 16, status: "online" },
  { hour: 17, status: "online" },
  { hour: 18, status: "online" },
  { hour: 19, status: "online" },
  { hour: 20, status: "online" },
  { hour: 21, status: "online" },
  { hour: 22, status: "online" },
  { hour: 23, status: "online" },

  { hour: 0, status: "online" },
  { hour: 1, status: "online" },
  { hour: 2, status: "online" },
  { hour: 3, status: "online" },
  { hour: 4, status: "online" },
  { hour: 5, status: "online" },
  { hour: 6, status: "online" },
  { hour: 7, status: "online" },
  { hour: 8, status: "online" },
  { hour: 9, status: "online" },
  { hour: 10, status: "online" },
  { hour: 11, status: "online" },
  { hour: 12, status: "online" },
  { hour: 13, status: "online" },
  { hour: 14, status: "online" },
  { hour: 15, status: "online" },
  { hour: 16, status: "online" },
  { hour: 17, status: "online" },
  { hour: 18, status: "online" },
  { hour: 19, status: "online" },
  { hour: 20, status: "online" },
  { hour: 21, status: "online" },
  { hour: 22, status: "online" },
  { hour: 23, status: "online" },
  { hour: 0, status: "online" },
  { hour: 1, status: "online" },
]);
</script>

<template>
  <div
    class="ring ring-border divide-y divide-(--ui-border) rounded-xl shadow-sm"
  >
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-primary"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <span class="font-medium">{{ domain }}</span>
      </div>
      <span class="text-sm dark:text-gray-400">{{ uptime }}</span>
    </div>

    <div class="p-4">
      <div
        v-for="(outage, index) in outages"
        :key="index"
        class="w-2.5 h-8 first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br ml-[3px] inline-block"
        :class="outage.status === 'online' ? 'bg-primary' : 'bg-white'"
      ></div>
    </div>
  </div>
</template>
