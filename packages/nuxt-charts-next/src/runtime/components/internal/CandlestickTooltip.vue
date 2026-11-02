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
import { formatNumber } from "../../utils/format";
import { injectChartUi } from "../../composables/useChartUi";

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
  title?: string | number;
}>();

const ui = injectChartUi();

const directionColor = computed(() =>
  props.row.close >= props.row.open ? props.upColor : props.downColor,
);

function fmt(value: number): string {
  return props.valueFormatter ? props.valueFormatter(value) : formatNumber(value);
}

const rows = computed(() => {
  const r = props.row;
  return [
    { name: "Open", value: fmt(r.open), color: directionColor.value },
    { name: "High", value: fmt(r.high), color: props.upColor },
    { name: "Low", value: fmt(r.low), color: props.downColor },
    { name: "Close", value: fmt(r.close), color: directionColor.value },
    ...(r.volume != null && !Number.isNaN(r.volume)
      ? [{ name: "Volume", value: formatNumber(r.volume), color: "var(--ui-text-dimmed, var(--vc-tooltip-muted, oklch(0.556 0 0)))" }]
      : []),
  ];
});
</script>

<template>
  <div data-slot="tooltip" class="vc-tooltip" :class="ui.slot('tooltip')" :style="ui.themeStyle.tooltip">
    <p data-slot="tooltipTitle" class="vc-tooltip__label" :class="ui.slot('tooltipTitle')">{{ title ?? row.label }}</p>
    <ul data-slot="tooltipList" class="vc-tooltip__list" :class="ui.slot('tooltipList')">
      <li v-for="item in rows" :key="item.name" data-slot="tooltipRow" class="vc-tooltip__item" :class="ui.slot('tooltipRow')">
        <span data-slot="tooltipIndicator" class="vc-tooltip__dot" :class="ui.slot('tooltipIndicator')" :style="{ background: item.color }" />
        <span data-slot="tooltipLabel" class="vc-tooltip__name" :class="ui.slot('tooltipLabel')">{{ item.name }}</span>
        <span data-slot="tooltipValue" class="vc-tooltip__value" :class="ui.slot('tooltipValue')">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>
