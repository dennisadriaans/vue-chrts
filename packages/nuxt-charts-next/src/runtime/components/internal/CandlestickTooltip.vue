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
      ? [{ name: "Volume", value: r.volume.toLocaleString(), color: "var(--vc-tooltip-muted, oklch(0.556 0 0))" }]
      : []),
  ];
});
</script>

<template>
  <div class="vc-tooltip">
    <p class="vc-tooltip__label">{{ row.label }}</p>
    <ul class="vc-tooltip__list">
      <li v-for="item in rows" :key="item.name" class="vc-tooltip__item">
        <span class="vc-tooltip__dot" :style="{ background: item.color }" />
        <span class="vc-tooltip__name">{{ item.name }}</span>
        <span class="vc-tooltip__value">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>
