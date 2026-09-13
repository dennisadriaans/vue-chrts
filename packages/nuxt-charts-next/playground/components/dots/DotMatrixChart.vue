<script setup lang="ts">
/**
 * Density matrix — a value encoded as the dot's radius within a fixed grid.
 *
 * Every cell keeps its slot whatever the value, so the grid stays regular and
 * the eye reads intensity from dot area rather than position. Useful for a
 * week × hour heatmap without any colour scale.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** One inner array per row, each holding that row's values. */
    data: number[][];
    rowLabels?: string[];
    columnLabels?: string[];
    /** Edge of one grid cell, in px. */
    cell?: number;
    /** Largest dot diameter, as a fraction of the cell. */
    maxFill?: number;
    color?: string;
    /** Opacity of a cell whose value is zero. */
    minOpacity?: number;
  }>(),
  {
    rowLabels: () => [],
    columnLabels: () => [],
    cell: 22,
    maxFill: 0.82,
    color: "currentColor",
    minOpacity: 0.1,
  },
);

const LABEL_FONT_SIZE = 9;
/** Gutter on the left for row labels. */
const ROW_LABEL_WIDTH = 30;
/** Gutter on top for column labels. */
const COLUMN_LABEL_HEIGHT = 16;

const columnCount = computed(() =>
  props.data.reduce((widest, row) => Math.max(widest, row.length), 0),
);

const max = computed(() => {
  const flat = props.data.flat().filter((value) => Number.isFinite(value));
  return flat.length ? Math.max(1, ...flat) : 1;
});

const viewWidth = computed(
  () => ROW_LABEL_WIDTH + columnCount.value * props.cell,
);
const viewHeight = computed(
  () => COLUMN_LABEL_HEIGHT + props.data.length * props.cell,
);

interface Cell {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  key: string;
}

const cells = computed<Cell[]>(() =>
  props.data.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => {
      // Radius follows the square root of the value so dot AREA, not radius,
      // is proportional — area is what the eye actually compares.
      const t = Math.max(0, Math.min(1, value / max.value));
      const maxRadius = (props.cell * props.maxFill) / 2;

      return {
        key: `${rowIndex}-${colIndex}`,
        cx: ROW_LABEL_WIDTH + colIndex * props.cell + props.cell / 2,
        cy: COLUMN_LABEL_HEIGHT + rowIndex * props.cell + props.cell / 2,
        r: Math.max(1, Math.sqrt(t) * maxRadius),
        opacity: props.minOpacity + (1 - props.minOpacity) * t,
      };
    }),
  ),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Dot density matrix"
  >
    <g :fill="color">
      <text
        v-for="(label, i) in columnLabels"
        :key="`col-${label}-${i}`"
        :x="ROW_LABEL_WIDTH + i * cell + cell / 2"
        :y="COLUMN_LABEL_HEIGHT - 5"
        text-anchor="middle"
        :font-size="LABEL_FONT_SIZE"
        fill-opacity="0.5"
      >
        {{ label }}
      </text>
      <text
        v-for="(label, i) in rowLabels"
        :key="`row-${label}-${i}`"
        :x="ROW_LABEL_WIDTH - 8"
        :y="COLUMN_LABEL_HEIGHT + i * cell + cell / 2 + 3"
        text-anchor="end"
        :font-size="LABEL_FONT_SIZE"
        fill-opacity="0.5"
      >
        {{ label }}
      </text>
      <circle
        v-for="c in cells"
        :key="c.key"
        :cx="c.cx"
        :cy="c.cy"
        :r="c.r"
        :fill-opacity="c.opacity"
      />
    </g>
  </svg>
</template>
