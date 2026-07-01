<script setup lang="ts">
/**
 * Tooltip content for {@link CandlestickChart}.
 *
 * The chart owns its SVG and hover state, so this receives the already-resolved
 * OHLC row plus the resolved up/down colours and price formatter, and renders
 * the four prices (and volume, when present) coloured by candle direction. It is
 * decoupled from any charting engine — just presentation.
 */
import { computed } from "vue";

interface Row {
  label: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

const props = defineProps<{
  row: Row;
  upColor: string;
  downColor: string;
  valueFormatter?: (value: number) => string;
}>();

const directionColor = computed(() =>
  props.row.close >= props.row.open ? props.upColor : props.downColor,
);

function fmt(value: number): string {
  return props.valueFormatter ? props.valueFormatter(value) : value.toLocaleString();
}

const rows = computed(() => {
  const r = props.row;
  return [
    { name: "Open", value: fmt(r.open), color: directionColor.value },
    { name: "High", value: fmt(r.high), color: props.upColor },
    { name: "Low", value: fmt(r.low), color: props.downColor },
    { name: "Close", value: fmt(r.close), color: directionColor.value },
    ...(r.volume != null && !Number.isNaN(r.volume)
      ? [{ name: "Volume", value: r.volume.toLocaleString(), color: "var(--muted-foreground, #6b7280)" }]
      : []),
  ];
});
</script>

<template>
  <div class="chart-tooltip">
    <p class="chart-tooltip__label">{{ row.label }}</p>
    <ul class="chart-tooltip__list">
      <li v-for="item in rows" :key="item.name" class="chart-tooltip__item">
        <span class="chart-tooltip__dot" :style="{ background: item.color }" />
        <span class="chart-tooltip__name">{{ item.name }}</span>
        <span class="chart-tooltip__value">{{ item.value }}</span>
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
