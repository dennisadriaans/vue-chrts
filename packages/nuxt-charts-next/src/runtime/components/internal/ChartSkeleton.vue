<script setup lang="ts">
/**
 * Placeholder shown in place of a chart while its data loads.
 *
 * Rendered instead of the chart, not over it: a real chart with no data draws
 * axes against an empty domain, which reads as "there is nothing here" rather
 * than "this is still loading".
 *
 * The silhouette is deterministic rather than random. `Math.random()` would
 * produce different markup on the server and the client and trip a hydration
 * mismatch — the same reason `utils/dither` hardcodes its noise offsets.
 *
 * Built from HTML rather than SVG so the shimmer is a plain CSS animation with
 * no `<defs>` ids to scope, and so it inherits the chart's colour tokens.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Height of the placeholder in pixels, matching the chart it stands in for. */
    height?: number;
    /** Silhouette to draw: a bar chart, a filled curve, or a ring. */
    shape?: "bars" | "wave" | "ring";
    /** Number of bars in the `bars` silhouette. */
    bars?: number;
    /** Text in the loading pill. Set empty to hide the pill. */
    label?: string;
  }>(),
  { height: 200, shape: "bars", bars: 12, label: "Loading" },
);

/**
 * Fixed pseudo-random heights, as a fraction of the plot. Cycled rather than
 * generated so the silhouette is stable across renders and SSR/client
 * hydration, and reads as data rather than as a repeating sawtooth.
 */
const HEIGHTS = [0.42, 0.78, 0.55, 0.9, 0.34, 0.66, 0.48, 0.83, 0.6, 0.28, 0.72, 0.5];

const barHeights = computed(() =>
  Array.from({ length: props.bars }, (_, i) => HEIGHTS[i % HEIGHTS.length]!),
);

/**
 * A closed path tracing the same heights, so the `wave` silhouette reads as the
 * area chart it replaces. Sampled in a 100x100 box and stretched by the SVG's
 * non-uniform `preserveAspectRatio`.
 *
 * Drawn as quadratic segments through the midpoints between samples rather than
 * straight lines: a polyline through these heights reads as a jagged mountain
 * range, not as the smooth curve an area chart draws.
 */
const wavePath = computed(() => {
  const heights = barHeights.value;
  const points = heights.map((h, i) => ({
    x: (i / (heights.length - 1)) * 100,
    y: 100 - h * 90 - 5,
  }));

  const first = points[0]!;
  let d = `M0,100 L${first.x.toFixed(2)},${first.y.toFixed(2)}`;

  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1]!;
    const current = points[i]!;
    // Curve out of the previous sample and land on the midpoint, so consecutive
    // segments share a tangent and the join stays smooth.
    const midX = (previous.x + current.x) / 2;
    const midY = (previous.y + current.y) / 2;
    d += ` Q${previous.x.toFixed(2)},${previous.y.toFixed(2)} ${midX.toFixed(2)},${midY.toFixed(2)}`;
  }

  const last = points[points.length - 1]!;
  return `${d} L${last.x.toFixed(2)},${last.y.toFixed(2)} L100,100 Z`;
});
</script>

<template>
  <div class="vc-skeleton" :style="{ height: `${height}px` }" role="status" aria-busy="true">
    <div v-if="shape === 'bars'" class="vc-skeleton__bars">
      <div
        v-for="(h, i) in barHeights"
        :key="i"
        class="vc-skeleton__bar"
        :style="{ height: `${h * 100}%` }"
      />
    </div>

    <svg
      v-else-if="shape === 'wave'"
      class="vc-skeleton__wave"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path :d="wavePath" fill="currentColor" />
    </svg>

    <div v-else class="vc-skeleton__ring" />

    <!-- Sweeps across whichever silhouette is showing. -->
    <div class="vc-skeleton__shimmer" aria-hidden="true" />

    <div v-if="label" class="vc-skeleton__pill">
      <span class="vc-skeleton__spinner" aria-hidden="true" />
      <span>{{ label }}</span>
    </div>
  </div>
</template>
