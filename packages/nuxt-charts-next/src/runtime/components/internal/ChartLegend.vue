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
  <ul class="chart-legend">
    <li
      v-for="item in payload"
      :key="item.value"
      class="chart-legend__item"
      :class="{ 'chart-legend__item--inactive': item.inactive }"
    >
      <span
        class="chart-legend__dot"
        :style="{ background: item.color }"
      />
      <span class="chart-legend__label">{{ item.value }}</span>
    </li>
  </ul>
</template>

<style scoped>
.chart-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  line-height: 1.5;
}

.chart-legend__item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.chart-legend__item--inactive {
  opacity: 0.4;
}

.chart-legend__dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.chart-legend__label {
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
}
</style>
