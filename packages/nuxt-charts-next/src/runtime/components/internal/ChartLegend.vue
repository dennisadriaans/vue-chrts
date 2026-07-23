<script setup lang="ts">
interface LegendItem {
  value: string;
  color?: string;
  inactive?: boolean;
}

defineProps<{
  payload?: LegendItem[];
}>();
</script>

<template>
  <ul class="vc-legend">
    <li
      v-for="item in payload"
      :key="item.value"
      class="vc-legend__item"
      :class="{ 'vc-legend__item--inactive': item.inactive }"
    >
      <span
        class="vc-legend__dot"
        :style="{ background: item.color }"
      />
      <span class="vc-legend__label">{{ item.value }}</span>
    </li>
  </ul>
</template>
