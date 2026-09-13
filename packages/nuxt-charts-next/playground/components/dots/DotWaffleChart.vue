<script setup lang="ts">
/**
 * Part-to-whole as a waffle of dots — one dot per unit, filled left to right.
 *
 * Reads as a percentage without a pie or a bar: the count of solid dots
 * against the faint remainder is the value. Rows fill bottom-up so a rising
 * share grows upward, the way a gauge would.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Share of the whole, 0–1. */
    value: number;
    columns?: number;
    rows?: number;
    /** Diameter of one dot, in px. */
    dotSize?: number;
    gap?: number;
    color?: string;
    /** Opacity of the unfilled remainder. */
    emptyOpacity?: number;
  }>(),
  {
    columns: 10,
    rows: 10,
    dotSize: 9,
    gap: 5,
    color: "currentColor",
    emptyOpacity: 0.12,
  },
);

const total = computed(() => props.columns * props.rows);

const filledCount = computed(() =>
  Math.round(Math.max(0, Math.min(1, props.value)) * total.value),
);

const stride = computed(() => props.dotSize + props.gap);

const viewWidth = computed(() => props.columns * stride.value - props.gap);
const viewHeight = computed(() => props.rows * stride.value - props.gap);

interface Unit {
  cx: number;
  cy: number;
  filled: boolean;
}

const units = computed<Unit[]>(() =>
  Array.from({ length: total.value }, (_, i) => {
    const row = Math.floor(i / props.columns);
    const col = i % props.columns;

    return {
      // Fill bottom-up: row 0 of the data is the bottom row on screen.
      cx: col * stride.value + props.dotSize / 2,
      cy:
        (props.rows - 1 - row) * stride.value + props.dotSize / 2,
      filled: i < filledCount.value,
    };
  }),
);

const percent = computed(() =>
  Math.round(Math.max(0, Math.min(1, props.value)) * 100),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-label="`Waffle chart showing ${percent} percent`"
  >
    <g :fill="color">
      <circle
        v-for="(unit, i) in units"
        :key="i"
        :cx="unit.cx"
        :cy="unit.cy"
        :r="dotSize / 2"
        :fill-opacity="unit.filled ? 1 : emptyOpacity"
      />
    </g>
  </svg>
</template>
