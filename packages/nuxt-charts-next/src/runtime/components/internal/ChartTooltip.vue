<script setup lang="ts">
import { computed } from "vue";
import type { TooltipContentProps } from "vccs";

defineOptions({ name: "ChartTooltip", inheritAttrs: false });

const props = defineProps<TooltipContentProps>();

const items = computed(() =>
  (props.payload ?? []).filter((p) => p.value !== null && p.value !== undefined),
);

function formatValue(value: unknown): string {
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
</script>

<template>
  <div
    v-if="active && items.length"
    class="chart-tooltip"
  >
    <p v-if="label !== undefined && label !== ''" class="chart-tooltip__label">
      {{ label }}
    </p>
    <ul class="chart-tooltip__list">
      <li v-for="item in items" :key="item.dataKey as string" class="chart-tooltip__item">
        <span
          class="chart-tooltip__dot"
          :style="{ background: item.color ?? item.fill ?? item.stroke }"
        />
        <span class="chart-tooltip__name">{{ item.name }}</span>
        <span class="chart-tooltip__value">{{ formatValue(item.value) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.chart-tooltip {
  min-width: 8rem;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border, 214.3 31.8% 91.4%));
  background: hsl(var(--popover, 0 0% 100%));
  color: hsl(var(--popover-foreground, 222.2 84% 4.9%));
  padding: 0.375rem 0.625rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 0.75rem;
  line-height: 1.5;
  pointer-events: none;
}

.chart-tooltip__label {
  margin: 0 0 0.25rem;
  font-weight: 500;
  font-size: 0.75rem;
  color: hsl(var(--foreground, 222.2 84% 4.9%));
}

.chart-tooltip__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.chart-tooltip__item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.chart-tooltip__dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.chart-tooltip__name {
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
}

.chart-tooltip__value {
  margin-left: auto;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: hsl(var(--foreground, 222.2 84% 4.9%));
}
</style>
