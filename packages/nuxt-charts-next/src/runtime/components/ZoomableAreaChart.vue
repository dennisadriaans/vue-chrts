<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { min, max } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import { area, line, curveCatmullRom, curveLinear, curveMonotoneX, curveStep, type CurveFactory } from "d3-shape";
import { zoom, zoomIdentity, type ZoomTransform, type ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";
import { categoriesToSeries } from "../utils/categories";
import type { ZoomableAreaChartProps } from "../types/charts";
import { CurveType } from "../enums";

const props = withDefaults(defineProps<ZoomableAreaChartProps<T>>(), {
  height: 300,
  lineWidth: 2,
  fillOpacity: 0.15,
  hideArea: false,
  hideLegend: false,
  hideTooltip: false,
  hideXAxis: false,
  hideYAxis: false,
  minZoom: 1,
  maxZoom: 8,
  yPaddingFactor: 0.08,
});

// ─── Layout ─────────────────────────────────────────────────────────────────

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const svgRef = useTemplateRef<SVGSVGElement>("svgRef");

const containerWidth = ref(600);

const PAD = computed(() => ({
  top: props.padding?.top ?? 16,
  right: props.padding?.right ?? 16,
  bottom: props.padding?.bottom ?? 40,
  left: props.padding?.left ?? 56,
}));

const W = computed(() => containerWidth.value);
const H = computed(() => props.height);

// ─── Data ────────────────────────────────────────────────────────────────────

const xKey = computed(() => props.xKey as string);

const series = computed(() => categoriesToSeries(props.categories));

/** All numeric values across all visible series — used for Y domain. */
function allValuesForRows(rows: T[]): number[] {
  return series.value
    .filter((s) => !s.hidden)
    .flatMap((s) => rows.map((row) => Number(row[s.dataKey])).filter(isFinite));
}

// ─── Zoom ────────────────────────────────────────────────────────────────────

const currentTransform = ref<ZoomTransform>(zoomIdentity);
let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | null = null;

// ─── X Scale ─────────────────────────────────────────────────────────────────

const baseScaleX = computed(() =>
  scalePoint<number>()
    .domain(props.data.map((_, i) => i))
    .range([PAD.value.left, W.value - PAD.value.right])
    .padding(0.5),
);

const xScale = computed(() => {
  const base = baseScaleX.value;
  const t = currentTransform.value;
  const [r0, r1] = base.range();
  return scalePoint<number>()
    .domain(base.domain())
    .range([t.applyX(r0), t.applyX(r1)])
    .padding(base.padding());
});

// ─── Visible points ───────────────────────────────────────────────────────────

const visibleIndices = computed(() =>
  props.data.map((_, i) => i).filter((i) => {
    const x = xScale.value(i) ?? 0;
    return x >= PAD.value.left - 1 && x <= W.value - PAD.value.right + 1;
  }),
);

const visibleData = computed((): T[] =>
  visibleIndices.value.map((i) => props.data[i]).filter((row): row is T => row !== undefined),
);

// ─── Y Scale (dynamic to visible window) ─────────────────────────────────────

const yMin = computed(() => {
  const src = visibleData.value.length ? visibleData.value : props.data;
  const vals = allValuesForRows(src);
  const raw = min(vals) ?? 0;
  const rawMax = max(vals) ?? raw + 1;
  const span = rawMax - raw;
  return raw - span * props.yPaddingFactor;
});

const yMax = computed(() => {
  const src = visibleData.value.length ? visibleData.value : props.data;
  const vals = allValuesForRows(src);
  const raw = max(vals) ?? 100;
  const rawMin = min(vals) ?? 0;
  const span = raw - rawMin;
  return raw + span * props.yPaddingFactor;
});

const yScale = computed(() =>
  scaleLinear()
    .domain([yMin.value, yMax.value])
    .range([H.value - PAD.value.bottom, PAD.value.top]),
  // No .nice() — it collapses tight ranges to repeated round values
);

// ─── Y ticks ─────────────────────────────────────────────────────────────────

const yTicks = computed(() => {
  const count = props.yNumTicks ?? 5;
  return yScale.value.ticks(count).map((v) => ({
    value: v,
    y: yScale.value(v),
    label: props.yFormatter ? props.yFormatter(v) : formatValue(v),
  }));
});

function formatValue(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// ─── X ticks (density adapts to zoom level) ───────────────────────────────────

const xTicks = computed(() => {
  const n = props.data.length;
  const k = currentTransform.value.k;
  const step = Math.max(1, Math.ceil(n / 6 / k));
  return props.data
    .map((row, i) => ({
      i,
      label: props.xFormatter
        ? props.xFormatter(i)
        : String(row[xKey.value] ?? i),
      x: xScale.value(i) ?? 0,
    }))
    .filter((_, i) => i === 0 || i === n - 1 || i % step === 0)
    .filter((t) => t.x >= PAD.value.left && t.x <= W.value - PAD.value.right);
});

// ─── Curve factory ───────────────────────────────────────────────────────────

const curveFactory = computed((): CurveFactory => {
  switch (props.curveType) {
    case CurveType.CatmullRom:
      return curveCatmullRom;
    case CurveType.MonotoneX:
      return curveMonotoneX;
    case CurveType.Step:
      return curveStep;
    default:
      return curveLinear;
  }
});

// ─── Path generators ─────────────────────────────────────────────────────────

interface PathSet {
  dataKey: string;
  color: string;
  areaPath: string | null;
  linePath: string | null;
}

const paths = computed((): PathSet[] =>
  series.value
    .filter((s) => !s.hidden)
    .map((s) => {
      const xAt = (i: number) => xScale.value(visibleIndices.value[i] ?? i) ?? 0;
      const yAt = (row: T) => yScale.value(Number(row[s.dataKey]));
      const defined = (row: T) => isFinite(Number(row[s.dataKey]));

      const areaGen = area<T>()
        .x((_, i) => xAt(i))
        .y0(H.value - PAD.value.bottom)
        .y1(yAt)
        .defined(defined)
        .curve(curveFactory.value);

      const lineGen = line<T>()
        .x((_, i) => xAt(i))
        .y(yAt)
        .defined(defined)
        .curve(curveFactory.value);

      return {
        dataKey: s.dataKey,
        color: s.color,
        areaPath: areaGen(visibleData.value),
        linePath: lineGen(visibleData.value),
      };
    }),
);

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  rowIndex: number;
  svgX: number;
}

const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, rowIndex: -1, svgX: 0 });

const activeRow = computed((): T | undefined => props.data[tooltip.value.rowIndex]);

function onMouseMove(event: MouseEvent) {
  if (props.hideTooltip) return;
  const svg = svgRef.value;
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;

  // Snap to nearest data point
  let closest = -1;
  let minDist = Infinity;
  props.data.forEach((_, i) => {
    const x = xScale.value(i) ?? 0;
    const dist = Math.abs(x - mouseX);
    if (dist < minDist) { minDist = dist; closest = i; }
  });

  if (closest === -1) return;

  const ptX = xScale.value(closest) ?? 0;
  if (ptX < PAD.value.left || ptX > W.value - PAD.value.right) {
    tooltip.value.visible = false;
    return;
  }

  // Position tooltip above the chart area, flip if near right edge
  const tipX = ptX + rect.left;
  const tipY = rect.top + PAD.value.top;

  tooltip.value = { visible: true, x: tipX, y: tipY, rowIndex: closest, svgX: ptX };
}

function onMouseLeave() {
  tooltip.value.visible = false;
}

// ─── Legend toggle ───────────────────────────────────────────────────────────

const hiddenKeys = ref(new Set<string>());

function toggleSeries(key: string) {
  const next = new Set(hiddenKeys.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  hiddenKeys.value = next;
}

const displaySeries = computed(() =>
  series.value.map((s) => ({ ...s, hidden: s.hidden || hiddenKeys.value.has(s.dataKey) })),
);

// ─── ResizeObserver ──────────────────────────────────────────────────────────

let ro: ResizeObserver | null = null;

onMounted(() => {
  ro = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width;
    if (w && w > 0) containerWidth.value = w;
  });
  if (containerRef.value) ro.observe(containerRef.value);

  mountZoom();
});

onUnmounted(() => {
  ro?.disconnect();
});

function mountZoom() {
  const svgEl = svgRef.value;
  if (!svgEl) return;

  zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([props.minZoom, props.maxZoom])
    .extent([[PAD.value.left, 0], [W.value - PAD.value.right, H.value]])
    .translateExtent([[PAD.value.left, -Infinity], [W.value - PAD.value.right, Infinity]])
    .on("zoom", (event) => {
      currentTransform.value = event.transform;
    });

  select(svgEl).call(zoomBehavior);
}

// Re-mount zoom when size changes (extent needs updating)
watch(W, () => {
  if (svgRef.value && zoomBehavior) {
    zoomBehavior
      .extent([[PAD.value.left, 0], [W.value - PAD.value.right, H.value]])
      .translateExtent([[PAD.value.left, -Infinity], [W.value - PAD.value.right, Infinity]]);
    select(svgRef.value).call(zoomBehavior);
  }
});

// ─── Clip id (unique per instance) ───────────────────────────────────────────
const clipId = `zac-clip-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <div ref="containerRef" class="zoomable-area-chart" :style="{ position: 'relative' }">
    <!-- SVG chart -->
    <svg
      ref="svgRef"
      :width="W"
      :height="H"
      class="zoomable-area-chart__svg"
      style="cursor: grab; user-select: none; display: block; width: 100%;"
      :style="{ cursor: tooltip.visible ? 'crosshair' : undefined }"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <defs>
        <!-- Clip chart content to the plot area -->
        <clipPath :id="clipId">
          <rect
            :x="PAD.left"
            :y="PAD.top"
            :width="W - PAD.left - PAD.right"
            :height="H - PAD.top - PAD.bottom"
          />
        </clipPath>
      </defs>

      <!-- Y-axis gutter background (prevents content bleed behind labels) -->
      <rect :x="0" :y="0" :width="PAD.left" :height="H" fill="var(--chart-bg, transparent)" />
      <!-- Bottom gutter background -->
      <rect :x="0" :y="H - PAD.bottom" :width="W" :height="PAD.bottom" fill="var(--chart-bg, transparent)" />

      <!-- Y grid lines (inside clip, but we draw them behind data) -->
      <g :clip-path="`url(#${clipId})`">
        <line
          v-for="tick in yTicks"
          :key="tick.value"
          :x1="PAD.left"
          :x2="W - PAD.right"
          :y1="tick.y"
          :y2="tick.y"
          stroke="currentColor"
          class="zoomable-area-chart__grid"
          stroke-dasharray="3 3"
          stroke-opacity="0.2"
        />
      </g>

      <!-- Series paths (clipped) -->
      <g :clip-path="`url(#${clipId})`">
        <template v-for="p in paths" :key="p.dataKey">
          <!-- Area fill -->
          <path
            v-if="!hideArea && p.areaPath"
            :d="p.areaPath"
            :fill="p.color"
            :fill-opacity="fillOpacity"
            stroke="none"
          />
          <!-- Line stroke -->
          <path
            v-if="p.linePath"
            :d="p.linePath"
            fill="none"
            :stroke="p.color"
            :stroke-width="lineWidth"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </template>

        <!-- Crosshair + data dots on hover -->
        <template v-if="tooltip.visible && tooltip.rowIndex >= 0">
          <line
            :x1="tooltip.svgX"
            :x2="tooltip.svgX"
            :y1="PAD.top"
            :y2="H - PAD.bottom"
            stroke="currentColor"
            stroke-opacity="0.3"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <circle
            v-for="s in displaySeries.filter(s => !s.hidden)"
            :key="s.dataKey"
            :cx="tooltip.svgX"
            :cy="activeRow ? yScale(Number(activeRow[s.dataKey])) : 0"
            r="4"
            :fill="s.color"
            stroke="white"
            stroke-width="1.5"
          />
        </template>
      </g>

      <!-- X axis -->
      <g v-if="!hideXAxis">
        <line
          :x1="PAD.left"
          :x2="W - PAD.right"
          :y1="H - PAD.bottom"
          :y2="H - PAD.bottom"
          stroke="currentColor"
          stroke-opacity="0.3"
        />
        <g
          v-for="tick in xTicks"
          :key="tick.i"
          :transform="`translate(${tick.x},${H - PAD.bottom})`"
        >
          <text
            dy="1.25em"
            text-anchor="middle"
            font-size="11"
            fill="currentColor"
            opacity="0.6"
          >{{ tick.label }}</text>
        </g>
      </g>

      <!-- Y axis -->
      <g v-if="!hideYAxis">
        <line
          :x1="PAD.left"
          :x2="PAD.left"
          :y1="PAD.top"
          :y2="H - PAD.bottom"
          stroke="currentColor"
          stroke-opacity="0.3"
        />
        <g
          v-for="tick in yTicks"
          :key="tick.value"
          :transform="`translate(${PAD.left},${tick.y})`"
        >
          <text
            dx="-0.5em"
            dy="0.32em"
            text-anchor="end"
            font-size="11"
            fill="currentColor"
            opacity="0.6"
          >{{ tick.label }}</text>
        </g>
      </g>

      <!-- Axis labels -->
      <text
        v-if="xLabel"
        :x="PAD.left + (W - PAD.left - PAD.right) / 2"
        :y="H - 4"
        text-anchor="middle"
        font-size="12"
        fill="currentColor"
        opacity="0.7"
      >{{ xLabel }}</text>
      <text
        v-if="yLabel"
        :transform="`translate(14,${PAD.top + (H - PAD.top - PAD.bottom) / 2}) rotate(-90)`"
        text-anchor="middle"
        font-size="12"
        fill="currentColor"
        opacity="0.7"
      >{{ yLabel }}</text>
    </svg>

    <!-- Legend -->
    <div v-if="!hideLegend" class="zoomable-area-chart__legend">
      <button
        v-for="s in displaySeries"
        :key="s.dataKey"
        class="zoomable-area-chart__legend-item"
        :class="{ 'zoomable-area-chart__legend-item--hidden': s.hidden }"
        @click="toggleSeries(s.dataKey)"
      >
        <span
          class="zoomable-area-chart__legend-dot"
          :style="{ background: s.color }"
        />
        <span>{{ s.name }}</span>
      </button>
    </div>

    <!-- Tooltip (portalled to fixed position) -->
    <Teleport to="body">
      <div
        v-if="!hideTooltip && tooltip.visible && activeRow"
        class="zoomable-area-chart__tooltip"
        :style="{
          position: 'fixed',
          left: `${tooltip.x + 12}px`,
          top: `${tooltip.y}px`,
          pointerEvents: 'none',
          zIndex: 9999,
        }"
      >
        <p v-if="xKey" class="zoomable-area-chart__tooltip-label">
          {{ tooltipTitleFormatter
            ? tooltipTitleFormatter(activeRow)
            : String(activeRow[xKey as string] ?? tooltip.rowIndex) }}
        </p>
        <ul class="zoomable-area-chart__tooltip-list">
          <li
            v-for="s in displaySeries.filter(s => !s.hidden)"
            :key="s.dataKey"
            class="zoomable-area-chart__tooltip-item"
          >
            <span class="zoomable-area-chart__tooltip-dot" :style="{ background: s.color }" />
            <span class="zoomable-area-chart__tooltip-name">{{ s.name }}</span>
            <span class="zoomable-area-chart__tooltip-value">
              {{ yFormatter
                ? yFormatter(Number(activeRow[s.dataKey]))
                : formatValue(Number(activeRow[s.dataKey])) }}
            </span>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.zoomable-area-chart {
  width: 100%;
}

.zoomable-area-chart__svg {
  display: block;
  cursor: grab;
}

.zoomable-area-chart__svg:active {
  cursor: grabbing;
}

.zoomable-area-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.zoomable-area-chart__legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: currentColor;
  transition: opacity 0.15s;
}

.zoomable-area-chart__legend-item--hidden {
  opacity: 0.35;
}

.zoomable-area-chart__legend-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.zoomable-area-chart__tooltip {
  min-width: 8rem;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border, 214.3 31.8% 91.4%));
  background: hsl(var(--popover, 0 0% 100%));
  color: hsl(var(--popover-foreground, 222.2 84% 4.9%));
  padding: 0.375rem 0.625rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 0.75rem;
  line-height: 1.5;
}

.zoomable-area-chart__tooltip-label {
  margin: 0 0 0.25rem;
  font-weight: 500;
  font-size: 0.75rem;
  color: hsl(var(--foreground, 222.2 84% 4.9%));
}

.zoomable-area-chart__tooltip-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.zoomable-area-chart__tooltip-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.zoomable-area-chart__tooltip-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.zoomable-area-chart__tooltip-name {
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
}

.zoomable-area-chart__tooltip-value {
  margin-left: auto;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: hsl(var(--foreground, 222.2 84% 4.9%));
}
</style>
