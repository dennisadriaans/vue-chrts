<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * Candlestick (OHLC) chart.
 *
 * `vccs` has no candlestick primitive, and faking one with a hidden `<Bar>` on
 * top of a `<ComposedChart>` fought the engine for scales and hover. So this owns
 * its SVG directly and draws candles the way charting engines can't: a wick line
 * (high→low) plus a body rectangle (open↔close), hollow when falling.
 *
 * The public API stays in the config-prop style of the other `nuxt-charts`
 * components: accessors name the OHLC fields (defaulting to
 * `label`/`open`/`high`/`low`/`close`/`volume`), and formatters/colours are props.
 */
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import CandlestickTooltip from "./internal/CandlestickTooltip.vue";
import type { CandlestickChartProps } from "../types/charts";

const props = defineProps<CandlestickChartProps<T>>();

// ─── Accessors & options ──────────────────────────────────────────────────────

const xKey = computed(() => String(props.xAccessor ?? "label"));
const openKey = computed(() => String(props.openAccessor ?? "open"));
const highKey = computed(() => String(props.highAccessor ?? "high"));
const lowKey = computed(() => String(props.lowAccessor ?? "low"));
const closeKey = computed(() => String(props.closeAccessor ?? "close"));
const volumeKey = computed(() => String(props.volumeAccessor ?? "volume"));

const upColor = computed(() => props.upColor ?? "#10b981");
const downColor = computed(() => props.downColor ?? "#ef4444");
const showVolume = computed(() => props.showVolume ?? false);
const maxCandleWidth = computed(() => props.candleWidth ?? 18);
const wickWidth = computed(() => props.wickWidth ?? 1.5);
const yGridLine = computed(() => props.yGridLine ?? true);
const xGridLine = computed(() => props.xGridLine ?? false);
const yNumTicks = computed(() => props.yNumTicks ?? 5);

interface Candle {
  label: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

/** Normalise rows to the OHLC shape the candle layer + tooltip consume. */
const candles = computed<Candle[]>(() =>
  props.data.map((row) => ({
    label: row[xKey.value] as string | number,
    open: Number(row[openKey.value]),
    high: Number(row[highKey.value]),
    low: Number(row[lowKey.value]),
    close: Number(row[closeKey.value]),
    volume:
      props.volumeAccessor || volumeKey.value in row
        ? Number(row[volumeKey.value])
        : undefined,
  })),
);

// ─── Layout ───────────────────────────────────────────────────────────────────

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const W = ref(600);
const H = computed(() => props.height);

const PAD = computed(() => ({
  top: 12,
  right: props.hideYAxis ? 4 : 12,
  bottom: props.hideXAxis ? 4 : 36,
  left: props.hideYAxis ? 4 : 56,
}));

const chartW = computed(() => Math.max(W.value - PAD.value.left - PAD.value.right, 1));

/** Height reserved for the volume histogram band, and the gap above it. */
const VOL_GAP = 8;
const volumeH = computed(() => (showVolume.value ? H.value * 0.22 : 0));
const chartH = computed(() =>
  Math.max(
    H.value - PAD.value.top - PAD.value.bottom - volumeH.value - (showVolume.value ? VOL_GAP : 0),
    1,
  ),
);
const volumeTop = computed(() => PAD.value.top + chartH.value + VOL_GAP);

// ─── Scales ───────────────────────────────────────────────────────────────────

const priceMin = computed(() => {
  const dataMin = candles.value.length ? Math.min(...candles.value.map((c) => c.low)) : 0;
  return props.yDomain?.[0] ?? dataMin;
});
const priceMax = computed(() => {
  const dataMax = candles.value.length ? Math.max(...candles.value.map((c) => c.high)) : 1;
  return props.yDomain?.[1] ?? dataMax;
});
const priceRange = computed(() => Math.max(priceMax.value - priceMin.value, Number.EPSILON));

function priceToY(price: number): number {
  return PAD.value.top + ((priceMax.value - price) / priceRange.value) * chartH.value;
}

function indexToX(i: number): number {
  const n = candles.value.length || 1;
  return PAD.value.left + (i + 0.5) * (chartW.value / n);
}

const volumeMax = computed(() =>
  showVolume.value ? Math.max(...candles.value.map((c) => c.volume ?? 0), 1) : 1,
);

interface Layout {
  key: string | number;
  x: number;
  centerX: number;
  halfW: number;
  bodyTop: number;
  bodyH: number;
  wickTop: number;
  wickBottom: number;
  color: string;
  rising: boolean;
  volH: number;
  volY: number;
}

const layouts = computed<Layout[]>(() => {
  const n = candles.value.length || 1;
  const step = chartW.value / n;
  // Cap the body so dense series never overlap their neighbour.
  const halfW = Math.max(Math.min(maxCandleWidth.value, step * 0.7) / 2, 1);

  return candles.value.map((c, i) => {
    const rising = c.close >= c.open;
    const color = rising ? upColor.value : downColor.value;
    const centerX = indexToX(i);
    const bodyTop = priceToY(Math.max(c.open, c.close));
    const bodyBottom = priceToY(Math.min(c.open, c.close));
    const volH = showVolume.value ? ((c.volume ?? 0) / volumeMax.value) * volumeH.value : 0;

    return {
      key: c.label,
      x: centerX - halfW,
      centerX,
      halfW,
      bodyTop,
      bodyH: Math.max(bodyBottom - bodyTop, 1.5),
      wickTop: priceToY(c.high),
      wickBottom: priceToY(c.low),
      color,
      rising,
      volH,
      volY: volumeTop.value + volumeH.value - volH,
    };
  });
});

// ─── Ticks ────────────────────────────────────────────────────────────────────

const yTicks = computed(() => {
  const count = Math.max(yNumTicks.value, 2);
  return Array.from({ length: count }, (_, i) => {
    const price = priceMin.value + (priceRange.value / (count - 1)) * i;
    return { price, y: priceToY(price) };
  });
});

const xTicks = computed(() => {
  const n = candles.value.length;
  const step = Math.max(1, Math.ceil(n / 8));
  return candles.value
    .map((c, i) => ({
      label: props.xFormatter ? props.xFormatter(i) : c.label,
      x: indexToX(i),
      i,
    }))
    .filter((_, i) => i === 0 || i === n - 1 || i % step === 0);
});

function fmtPrice(value: number): string {
  return props.yFormatter ? props.yFormatter(value) : value.toLocaleString();
}

// ─── Hover / tooltip ──────────────────────────────────────────────────────────

const activeIndex = ref<number | null>(null);
const pointer = ref({ x: 0, y: 0 });

const activeCandle = computed(() =>
  activeIndex.value !== null ? candles.value[activeIndex.value] : null,
);
const activeLayout = computed(() =>
  activeIndex.value !== null ? layouts.value[activeIndex.value] : null,
);

function onMouseMove(e: MouseEvent) {
  if (props.hideTooltip) return;
  const rect = containerRef.value!.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const stepW = chartW.value / (candles.value.length || 1);
  const idx = Math.floor((mx - PAD.value.left) / stepW);
  if (idx >= 0 && idx < candles.value.length) {
    activeIndex.value = idx;
    pointer.value = { x: e.clientX, y: e.clientY };
  } else {
    activeIndex.value = null;
  }
}

function onMouseLeave() {
  activeIndex.value = null;
}

// ─── Resize ───────────────────────────────────────────────────────────────────

let ro: ResizeObserver | undefined;
onMounted(() => {
  if (!containerRef.value) return;
  ro = new ResizeObserver((entries) => {
    const cr = entries[0]?.contentRect;
    if (cr?.width) W.value = cr.width;
  });
  ro.observe(containerRef.value);
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <div
    ref="containerRef"
    class="candlestick-chart"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <svg :width="W" :height="H" class="candlestick-chart__svg">
      <!-- Grid -->
      <template v-if="yGridLine">
        <line
          v-for="tick in yTicks"
          :key="`yg-${tick.price}`"
          :x1="PAD.left"
          :x2="PAD.left + chartW"
          :y1="tick.y"
          :y2="tick.y"
          stroke="currentColor"
          stroke-opacity="0.15"
          stroke-dasharray="3 3"
        />
      </template>
      <template v-if="xGridLine">
        <line
          v-for="tick in xTicks"
          :key="`xg-${tick.i}`"
          :x1="tick.x"
          :x2="tick.x"
          :y1="PAD.top"
          :y2="PAD.top + chartH"
          stroke="currentColor"
          stroke-opacity="0.15"
          stroke-dasharray="3 3"
        />
      </template>

      <!-- Hover column highlight -->
      <rect
        v-if="activeLayout"
        :x="activeLayout.x - 4"
        :y="PAD.top"
        :width="activeLayout.halfW * 2 + 8"
        :height="chartH"
        rx="4"
        fill="currentColor"
        fill-opacity="0.06"
      />

      <!-- Volume histogram -->
      <template v-if="showVolume">
        <rect
          v-for="c in layouts"
          :key="`vol-${c.key}`"
          :x="c.x"
          :y="c.volY"
          :width="c.halfW * 2"
          :height="c.volH"
          :fill="c.color"
          fill-opacity="0.25"
          rx="1"
        />
      </template>

      <!-- Candles -->
      <g v-for="(c, i) in layouts" :key="c.key">
        <line
          :x1="c.centerX"
          :x2="c.centerX"
          :y1="c.wickTop"
          :y2="c.wickBottom"
          :stroke="c.color"
          :stroke-width="activeIndex === i ? wickWidth + 1 : wickWidth"
        />
        <rect
          :x="c.x"
          :y="c.bodyTop"
          :width="c.halfW * 2"
          :height="c.bodyH"
          :rx="Math.min(2, c.halfW / 2)"
          :fill="c.rising ? c.color : 'var(--chart-bg, #ffffff)'"
          :stroke="c.color"
          :stroke-width="activeIndex === i ? 2.5 : 1.5"
        />
      </g>

      <!-- Y axis -->
      <template v-if="!hideYAxis">
        <text
          v-for="tick in yTicks"
          :key="`yt-${tick.price}`"
          :x="PAD.left - 8"
          :y="tick.y"
          text-anchor="end"
          dominant-baseline="middle"
          fill="currentColor"
          opacity="0.6"
          font-size="11"
        >{{ fmtPrice(tick.price) }}</text>
        <text
          v-if="yLabel"
          :transform="`translate(14,${PAD.top + chartH / 2}) rotate(-90)`"
          text-anchor="middle"
          fill="currentColor"
          opacity="0.7"
          font-size="12"
        >{{ yLabel }}</text>
      </template>

      <!-- X axis -->
      <template v-if="!hideXAxis">
        <text
          v-for="tick in xTicks"
          :key="`xt-${tick.i}`"
          :x="tick.x"
          :y="PAD.top + chartH + (showVolume ? volumeH + VOL_GAP : 0) + 18"
          text-anchor="middle"
          fill="currentColor"
          opacity="0.6"
          font-size="11"
        >{{ tick.label }}</text>
        <text
          v-if="xLabel"
          :x="PAD.left + chartW / 2"
          :y="H - 2"
          text-anchor="middle"
          fill="currentColor"
          opacity="0.7"
          font-size="12"
        >{{ xLabel }}</text>
      </template>
    </svg>

    <Teleport to="body">
      <div
        v-if="!hideTooltip && activeCandle"
        class="candlestick-chart__tooltip"
        :style="{
          position: 'fixed',
          left: `${pointer.x + 12}px`,
          top: `${pointer.y}px`,
          pointerEvents: 'none',
          zIndex: 9999,
        }"
      >
        <CandlestickTooltip
          :row="activeCandle"
          :up-color="upColor"
          :down-color="downColor"
          :value-formatter="yFormatter"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.candlestick-chart {
  position: relative;
  width: 100%;
  cursor: crosshair;
  user-select: none;
}

.candlestick-chart__svg {
  display: block;
  width: 100%;
  overflow: visible;
}
</style>
