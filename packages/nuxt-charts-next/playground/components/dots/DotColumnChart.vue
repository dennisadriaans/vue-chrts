<script setup lang="ts">
/**
 * Dotted-column ("lollipop") chart.
 *
 * Each category is a vertical stack of small dots rising from the baseline,
 * topped by a larger cap dot that carries the value label. Dots fade toward
 * the baseline so the eye follows the cap line rather than the columns.
 *
 * Drawn as plain SVG rather than through `BarChart`'s `cubes` variant: that
 * variant renders uniform squares and disables `valueLabel`, while this shape
 * needs a distinct cap dot plus a label above it.
 */
import { computed } from "vue";
import { fadeAt, maxOf, type DotPoint } from "./geometry";

const props = withDefaults(
  defineProps<{
    data: DotPoint[];
    height?: number;
    /** Diameter of a stack dot, in px. */
    dotSize?: number;
    /** Diameter of the cap dot that tops each column, in px. */
    capSize?: number;
    /** Vertical gap between stack dots, in px. */
    gap?: number;
    color?: string;
    /** Fill opacity of the bottom-most stack dot; the cap side stays at 1. */
    minOpacity?: number;
    /** Hides every value label when false. */
    showValues?: boolean;
  }>(),
  {
    height: 320,
    dotSize: 5,
    capSize: 11,
    gap: 6,
    color: "currentColor",
    minOpacity: 0.06,
    showValues: true,
  },
);

/** Room above the tallest cap for its value label. */
const LABEL_SPACE = 22;
/** Gap between a cap dot and its value label baseline. */
const LABEL_OFFSET = 8;
const LABEL_FONT_SIZE = 11;

/** Horizontal stride between columns, so the viewBox scales with the series. */
const COLUMN_STRIDE = 34;

const viewWidth = computed(() =>
  Math.max(COLUMN_STRIDE, props.data.length * COLUMN_STRIDE),
);

const maxValue = computed(() => maxOf(props.data));

/** Vertical stride between dot centers. */
const stride = computed(() => props.dotSize + props.gap);

/**
 * Rows available between the baseline and the top of the plot. The tallest
 * column fills all of them, so `maxValue` maps onto `rows` dots.
 */
const rows = computed(() =>
  Math.max(1, Math.floor((props.height - LABEL_SPACE) / stride.value)),
);

const baselineY = computed(() => LABEL_SPACE + rows.value * stride.value);

interface Column {
  label: string;
  value: number;
  cx: number;
  /** Stack dots below the cap, baseline-first. */
  dots: { cy: number; opacity: number }[];
  capY: number;
}

const columns = computed<Column[]>(() =>
  props.data.map((point, index) => {
    const cx = index * COLUMN_STRIDE + COLUMN_STRIDE / 2;
    // At least one row, so a zero/tiny value still reads as a column.
    const value = point.value ?? 0;
    const filled = Math.max(
      1,
      Math.round((value / maxValue.value) * rows.value),
    );
    const capY = baselineY.value - (filled - 1) * stride.value;

    const dots = Array.from({ length: filled - 1 }, (_, row) => {
      const cy = baselineY.value - row * stride.value;
      // Ease-in fade: the washout accelerates toward the baseline.
      const t = filled > 1 ? 1 - row / (filled - 1) : 0;
      return { cy, opacity: fadeAt(t, props.minOpacity) };
    });

    return { label: point.label, value, cx, dots, capY };
  }),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${baselineY + props.dotSize}`"
    :height="height"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-label="`Dotted column chart of ${data.length} values`"
  >
    <g v-for="column in columns" :key="column.label" :fill="color">
      <circle
        v-for="(dot, i) in column.dots"
        :key="i"
        :cx="column.cx"
        :cy="dot.cy"
        :r="dotSize / 2"
        :fill-opacity="dot.opacity"
      />
      <circle :cx="column.cx" :cy="column.capY" :r="capSize / 2" />
      <text
        v-if="showValues"
        :x="column.cx"
        :y="column.capY - capSize / 2 - LABEL_OFFSET"
        text-anchor="middle"
        :font-size="LABEL_FONT_SIZE"
        font-weight="600"
      >
        {{ column.value }}
      </text>
    </g>
  </svg>
</template>
