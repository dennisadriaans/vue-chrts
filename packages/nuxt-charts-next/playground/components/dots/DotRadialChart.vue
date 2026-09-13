<script setup lang="ts">
/**
 * Radial dot chart — each category is a spoke of dots radiating from the
 * centre, its value read as how far the dots reach outward.
 *
 * A dot-only take on a radar/polar chart: no connecting web, so the shape
 * emerges from dot density alone. Dots fade toward the centre so the outer
 * rim, where the values actually differ, carries the weight.
 */
import { computed } from "vue";
import { fadeAt, maxOf, type DotPoint } from "./geometry";

const props = withDefaults(
  defineProps<{
    data: DotPoint[];
    /** Size of the square viewport, in px. */
    size?: number;
    /** Diameter of one dot, in px. */
    dotSize?: number;
    /** Spacing between dots along a spoke, in px. */
    step?: number;
    color?: string;
    /** Opacity at the innermost dot of a spoke. */
    minOpacity?: number;
    showLabels?: boolean;
  }>(),
  {
    size: 260,
    dotSize: 5,
    step: 9,
    color: "currentColor",
    minOpacity: 0.12,
    showLabels: true,
  },
);

const LABEL_FONT_SIZE = 9;
/** Ring reserved outside the plot for the spoke labels. */
const LABEL_MARGIN = 18;
/** Empty core so spokes do not collide at the centre. */
const INNER_RADIUS = 14;

const center = computed(() => props.size / 2);

const outerRadius = computed(() =>
  Math.max(INNER_RADIUS + props.step, center.value - LABEL_MARGIN),
);

const max = computed(() => maxOf(props.data));

/** Dots available along the longest spoke. */
const maxDots = computed(() =>
  Math.max(1, Math.floor((outerRadius.value - INNER_RADIUS) / props.step)),
);

interface Spoke {
  label: string;
  labelX: number;
  labelY: number;
  dots: { cx: number; cy: number; opacity: number }[];
}

const spokes = computed<Spoke[]>(() =>
  props.data.map((point, index) => {
    // Start at 12 o'clock and go clockwise, like a radar chart.
    const angle = (index / props.data.length) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const value = point.value ?? 0;
    const count = Math.max(
      1,
      Math.round((value / max.value) * maxDots.value),
    );

    const dots = Array.from({ length: count }, (_, i) => {
      const radius = INNER_RADIUS + i * props.step;
      return {
        cx: center.value + cos * radius,
        cy: center.value + sin * radius,
        // Fade inward: t is 1 at the centre, 0 at this spoke's outermost dot.
        opacity: fadeAt(count > 1 ? 1 - i / (count - 1) : 0, props.minOpacity),
      };
    });

    const labelRadius = outerRadius.value + 8;

    return {
      label: point.label,
      labelX: center.value + cos * labelRadius,
      labelY: center.value + sin * labelRadius + 3,
      dots,
    };
  }),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${size} ${size}`"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Radial dot chart"
  >
    <g :fill="color">
      <template v-for="spoke in spokes" :key="spoke.label">
        <circle
          v-for="(dot, i) in spoke.dots"
          :key="i"
          :cx="dot.cx"
          :cy="dot.cy"
          :r="dotSize / 2"
          :fill-opacity="dot.opacity"
        />
        <text
          v-if="showLabels"
          :x="spoke.labelX"
          :y="spoke.labelY"
          text-anchor="middle"
          :font-size="LABEL_FONT_SIZE"
          fill-opacity="0.5"
        >
          {{ spoke.label }}
        </text>
      </template>
    </g>
  </svg>
</template>
