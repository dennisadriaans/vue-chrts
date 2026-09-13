<script setup lang="ts">
/**
 * Range (dumbbell) chart in dots — two cap dots per category with a dotted
 * spine between them, so the bar shows a span rather than a total.
 *
 * The spine dots are faint; the two caps carry the endpoints. Good for
 * before/after or min/max comparisons where the distance is the story.
 */
import { computed } from "vue";

interface Range {
  label: string;
  from: number;
  to: number;
}

const props = withDefaults(
  defineProps<{
    data: Range[];
    height?: number;
    /** Diameter of an endpoint dot, in px. */
    capSize?: number;
    /** Diameter of a spine dot, in px. */
    dotSize?: number;
    /** Spacing between spine dots, in px. */
    step?: number;
    color?: string;
    /** Opacity of the spine connecting the two caps. */
    spineOpacity?: number;
    showLabels?: boolean;
  }>(),
  {
    height: 240,
    capSize: 10,
    dotSize: 4,
    step: 8,
    color: "currentColor",
    spineOpacity: 0.3,
    showLabels: true,
  },
);

const ROW_HEIGHT = 30;
const LABEL_WIDTH = 46;
const LABEL_FONT_SIZE = 10;
/** Inset on each side so a cap dot never clips the viewBox. */
const PLOT_INSET = 12;

const viewWidth = 420;
const viewHeight = computed(() => props.data.length * ROW_HEIGHT);

const bounds = computed(() => {
  const values = props.data.flatMap((row) => [row.from, row.to]);
  const lo = values.length ? Math.min(...values) : 0;
  const hi = values.length ? Math.max(...values) : 1;
  return { lo, span: hi - lo || 1 };
});

const plotStart = computed(() => LABEL_WIDTH + PLOT_INSET);
const plotWidth = computed(() => viewWidth - plotStart.value - PLOT_INSET);

interface Row {
  label: string;
  cy: number;
  fromX: number;
  toX: number;
  spine: number[];
}

const rows = computed<Row[]>(() =>
  props.data.map((row, index) => {
    const toX = (value: number) =>
      plotStart.value +
      ((value - bounds.value.lo) / bounds.value.span) * plotWidth.value;

    const fromX = toX(row.from);
    const endX = toX(row.to);
    const cy = index * ROW_HEIGHT + ROW_HEIGHT / 2;

    // Spine dots march between the caps, skipping the space each cap occupies.
    const lo = Math.min(fromX, endX) + props.capSize / 2 + props.step;
    const hi = Math.max(fromX, endX) - props.capSize / 2;
    const spine: number[] = [];
    for (let x = lo; x < hi; x += props.step) spine.push(x);

    return { label: row.label, cy, fromX, toX: endX, spine };
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
    aria-label="Dotted range chart"
  >
    <g :fill="color">
      <template v-for="row in rows" :key="row.label">
        <text
          v-if="showLabels"
          :x="LABEL_WIDTH - 8"
          :y="row.cy + 3"
          text-anchor="end"
          :font-size="LABEL_FONT_SIZE"
          fill-opacity="0.5"
        >
          {{ row.label }}
        </text>
        <circle
          v-for="(x, i) in row.spine"
          :key="i"
          :cx="x"
          :cy="row.cy"
          :r="dotSize / 2"
          :fill-opacity="spineOpacity"
        />
        <circle
          :cx="row.fromX"
          :cy="row.cy"
          :r="capSize / 2"
          fill-opacity="0.45"
        />
        <circle :cx="row.toX" :cy="row.cy" :r="capSize / 2" />
      </template>
    </g>
  </svg>
</template>
