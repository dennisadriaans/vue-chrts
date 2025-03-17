<script lang="ts" setup>
import { computed } from 'vue'
interface StorageProps {
  label: string;
  value: string;
  unit?: string;
  progress: number;
  total: number;
  color: string;
}

const props = defineProps<StorageProps>()

const percentage = computed(() => {
  return ((props.progress / props.total) * 100).toFixed(1);
});

const width = computed(() => {
  return `${(props.progress / props.total) * 100}%`;
});
</script>

<template>
  <div class="space-y-2">
    <div class="space-y-2">
      <p class="text-gray-500 mb-1">
        {{ label }}
      </p>
      <h2 class="text-xl dark:text-white font-bold">
        {{  value  }}
      </h2>
    </div>

    <div class="flex items-center justify-between text-sm font-medium dark:text-gray-500 mt-2">
      <div>{{ percentage }}%</div>
      <div>{{ progress }} of {{ total }}{{ unit }}</div>
    </div>
    <div class="dark:bg-white/5 bg-gray-100 rounded-full h-3">
      <div class="rounded-full h-full" :style="{ width, backgroundColor: color }"></div>
    </div>
  </div>
</template>