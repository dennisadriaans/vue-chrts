<script lang="ts" setup>
interface StatusDataItem {
  status: 'online' | 'offline';
}

interface StatusTrackerProps {
  domain: string;
  uptime: string;
  operationalStatus: boolean;
  barWidth?: number;
  barGap?: number;
  startLabel?: string;
  endLabel?: string;
  statusData: StatusDataItem[];
}

const props = withDefaults(defineProps<StatusTrackerProps>(), {
  barWidth: 4,
  barGap: 2,
  startLabel: '',
  endLabel: '',
});
</script>

<template>
  <div
    class="ring ring-gray-200 divide-y divide-gray-200 rounded-xl shadow-sm dark:ring-gray-800 dark:divide-gray-800"
  >
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-2">
        <svg
          v-if="props.operationalStatus"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-green-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-red-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <span class="font-medium">{{ props.domain }}</span>
      </div>
      <span class="text-sm dark:text-gray-400">{{ props.uptime }}</span>
    </div>

    <div class="p-4">
      <div class="flex items-center justify-between mb-2 text-sm text-gray-500">
        <span>{{ props.startLabel }}</span>
        <span>{{ props.endLabel }}</span>
      </div>
      <div class="flex items-center gap-0">
        <div
          v-for="(item, index) in props.statusData"
          :key="index"
          class="h-8 first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br"
          :style="{
            width: `${props.barWidth}px`,
            marginLeft: index === 0 ? '0' : `${props.barGap}px`,
            backgroundColor: item.status === 'online' ? 'rgb(34 197 94)' : 'rgb(239 68 68)'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
