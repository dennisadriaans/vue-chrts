<script setup lang="ts">
/**
 * Progress tracks made of dots — one row per metric, each a fixed-length run
 * of dots with the leading portion solid.
 *
 * A dot-only replacement for a stacked progress bar: the count of solid dots
 * is the value, and because every track is the same length the rows compare
 * directly without an axis.
 */
import { computed } from "vue";

interface Track {
  label: string;
  /** Share of the track filled, 0–1. */
  value: number;
}

const props = withDefaults(
  defineProps<{
    data: Track[];
    /** Dots per track. */
    steps?: number;
    /** Diameter of one dot, in px. */
    dotSize?: number;
    gap?: number;
    color?: string;
    emptyOpacity?: number;
    /** Prints the percentage at the end of each track. */
    showValues?: boolean;
  }>(),
  {
    steps: 24,
    dotSize: 6,
    gap: 4,
    color: "currentColor",
    emptyOpacity: 0.13,
    showValues: true,
  },
);

const ROW_HEIGHT = 28;
const LABEL_WIDTH = 74;
const LABEL_FONT_SIZE = 10;
/** Gutter on the right for the percentage readout. */
const VALUE_WIDTH = 34;

const stride = computed(() => props.dotSize + props.gap);

const viewWidth = computed(
  () => LABEL_WIDTH + props.steps * stride.value - props.gap + VALUE_WIDTH,
);
const viewHeight = computed(() => props.data.length * ROW_HEIGHT);

const rows = computed(() =>
  props.data.map((track, index) => {
    const clamped = Math.max(0, Math.min(1, track.value));
    const filled = Math.round(clamped * props.steps);
    const cy = index * ROW_HEIGHT + ROW_HEIGHT / 2;

    return {
      label: track.label,
      cy,
      percent: Math.round(clamped * 100),
      dots: Array.from({ length: props.steps }, (_, i) => ({
        cx: LABEL_WIDTH + i * stride.value + props.dotSize / 2,
        filled: i < filled,
      })),
    };
  }),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Dotted progress tracks"
  >
    <g :fill="color">
      <template v-for="row in rows" :key="row.label">
        <text
          :x="LABEL_WIDTH - 10"
          :y="row.cy + 3"
          text-anchor="end"
          :font-size="LABEL_FONT_SIZE"
          fill-opacity="0.55"
        >
          {{ row.label }}
        </text>
        <circle
          v-for="(dot, i) in row.dots"
          :key="i"
          :cx="dot.cx"
          :cy="row.cy"
          :r="dotSize / 2"
          :fill-opacity="dot.filled ? 1 : emptyOpacity"
        />
        <text
          v-if="showValues"
          :x="viewWidth - 4"
          :y="row.cy + 3"
          text-anchor="end"
          :font-size="LABEL_FONT_SIZE"
          font-weight="600"
          fill-opacity="0.8"
        >
          {{ row.percent }}%
        </text>
      </template>
    </g>
  </svg>
</template>
