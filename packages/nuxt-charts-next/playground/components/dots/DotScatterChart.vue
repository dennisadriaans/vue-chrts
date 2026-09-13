<script setup lang="ts">
/**
 * Scatter plot with a dotted grid behind it.
 *
 * The grid is faint dots rather than ruled lines, so the whole chart — plot
 * and chrome alike — is built from circles. Point radius carries an optional
 * third dimension (`size`), which makes it double as a bubble chart.
 */
import { computed } from "vue";

interface Sample {
  x: number;
  y: number;
  /** Optional third dimension, mapped to dot area. */
  size?: number;
}

const props = withDefaults(
  defineProps<{
    data: Sample[];
    height?: number;
    /** Diameter of a point when it carries no `size`, in px. */
    dotSize?: number;
    /** Largest diameter a sized point can reach, in px. */
    maxDotSize?: number;
    /** Spacing of the dotted background grid, in px. */
    gridStep?: number;
    color?: string;
    gridOpacity?: number;
  }>(),
  {
    height: 240,
    dotSize: 7,
    maxDotSize: 18,
    gridStep: 18,
    color: "currentColor",
    gridOpacity: 0.14,
  },
);

const viewWidth = 360;
const viewHeight = computed(() => props.height);
/** Keeps the largest dot clear of the edges. */
const INSET = 16;

const bounds = computed(() => {
  const xs = props.data.map((d) => d.x);
  const ys = props.data.map((d) => d.y);
  const spread = (values: number[]) => {
    if (!values.length) return { lo: 0, span: 1 };
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    return { lo, span: hi - lo || 1 };
  };
  return { x: spread(xs), y: spread(ys) };
});

const maxSize = computed(() => {
  const sizes = props.data
    .map((d) => d.size)
    .filter((s): s is number => s != null && Number.isFinite(s));
  return sizes.length ? Math.max(1, ...sizes) : 1;
});

/** Faint background grid of dots, laid out on a fixed pitch. */
const grid = computed(() => {
  const dots: { cx: number; cy: number }[] = [];
  for (let x = INSET; x <= viewWidth - INSET; x += props.gridStep) {
    for (let y = INSET; y <= viewHeight.value - INSET; y += props.gridStep) {
      dots.push({ cx: x, cy: y });
    }
  }
  return dots;
});

const points = computed(() =>
  props.data.map((sample, i) => {
    const plotW = viewWidth - INSET * 2;
    const plotH = viewHeight.value - INSET * 2;
    // Radius follows sqrt so the AREA scales with `size`.
    const t = sample.size != null ? sample.size / maxSize.value : null;
    const diameter =
      t == null ? props.dotSize : Math.max(props.dotSize, Math.sqrt(t) * props.maxDotSize);

    return {
      key: i,
      cx: INSET + ((sample.x - bounds.value.x.lo) / bounds.value.x.span) * plotW,
      // SVG y grows downward, so invert to put larger values at the top.
      cy:
        INSET +
        plotH -
        ((sample.y - bounds.value.y.lo) / bounds.value.y.span) * plotH,
      r: diameter / 2,
    };
  }),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    :height="height"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Dot scatter plot on a dotted grid"
  >
    <g :fill="color">
      <circle
        v-for="(dot, i) in grid"
        :key="`g-${i}`"
        :cx="dot.cx"
        :cy="dot.cy"
        r="1"
        :fill-opacity="gridOpacity"
      />
      <circle
        v-for="point in points"
        :key="`p-${point.key}`"
        :cx="point.cx"
        :cy="point.cy"
        :r="point.r"
        fill-opacity="0.9"
      />
    </g>
  </svg>
</template>
