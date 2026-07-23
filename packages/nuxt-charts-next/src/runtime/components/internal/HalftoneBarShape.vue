<script setup lang="ts">
/**
 * One halftone-dithered bar (or stacked segment) for `BarChart`
 * `variant="halftone"`.
 *
 * Rendered through the `vccs` `<Bar>` `#shape` slot. The segment is sliced into
 * horizontal strips, each painted with a different coverage level of the shared
 * lattice, so the column runs from solid on the baseline to sparse specks at
 * its top — a 1-bit ordered dither rather than an alpha fade.
 *
 * The lattice patterns themselves live in `HalftoneDefs`, emitted once per
 * chart; this component only picks which level each strip references.
 */
import { computed } from "vue";
import { halftoneLevelId } from "./HalftoneDefs";

const props = withDefaults(
  defineProps<{
    x?: number | null;
    y?: number | null;
    width?: number;
    height?: number;
    fill?: string;
    /** Chart-wide scope, matching the `HalftoneDefs` that emitted the levels. */
    scope: string;
    /** How many coverage levels exist. Must match `HalftoneDefs`. */
    steps?: number;
    /**
     * Height in px of the solid cap drawn at the top of the segment. The
     * references all carry a crisp bright edge there, which is what stops the
     * sparse end from looking like noise.
     */
    capHeight?: number;
    /** Corner radius applied to the segment as a whole. */
    radius?: number;
  }>(),
  { steps: 12, capHeight: 3, radius: 0 },
);

/**
 * Strips from the top of the segment down to its baseline.
 *
 * Level 0 is the sparse end of the ramp, so the *top* strip takes level 0 and
 * the bottom takes the densest. Strips overlap by a hair because exact edges
 * leave hairline seams once the browser rounds them to device pixels.
 */
const strips = computed(() => {
  const { x, y, width = 0, height = 0, steps } = props;
  if (x == null || y == null || width <= 0 || height <= 0) return [];

  const cap = Math.min(props.capHeight, height);
  const body = Math.max(0, height - cap);
  if (body <= 0) return [];

  const each = body / steps;
  return Array.from({ length: steps }, (_, i) => ({
    key: i,
    x,
    y: y + cap + i * each,
    width,
    height: each + 0.5,
    // Top strip is sparsest; walk toward the dense end going down.
    level: steps - 1 - i,
  }));
});

const cap = computed(() => {
  const { x, y, width = 0, height = 0 } = props;
  if (x == null || y == null || width <= 0 || height <= 0) return null;
  return { x, y, width, height: Math.min(props.capHeight, height) };
});
</script>

<template>
  <g>
    <!--
      Clip to the segment so the strips (which overlap by half a pixel) cannot
      bleed past the bar, and so `radius` still rounds the column.
    -->
    <clipPath :id="`${scope}-clip-${x}-${y}`">
      <rect
        :x="x ?? 0"
        :y="y ?? 0"
        :width="width ?? 0"
        :height="height ?? 0"
        :rx="radius"
        :ry="radius"
      />
    </clipPath>
    <g :clip-path="`url(#${scope}-clip-${x}-${y})`">
      <!-- Solid cap: the bright leading edge every reference carries. -->
      <rect
        v-if="cap"
        :x="cap.x"
        :y="cap.y"
        :width="cap.width"
        :height="cap.height"
        :fill="fill"
      />
      <!--
        One rect per strip, filled with that level's lattice. The patterns are
        already painted in the series colour, so referencing them directly keeps
        one paint server per level rather than one per bar.
      -->
      <rect
        v-for="strip in strips"
        :key="strip.key"
        :x="strip.x"
        :y="strip.y"
        :width="strip.width"
        :height="strip.height"
        :fill="`url(#${halftoneLevelId(scope, strip.level)})`"
      />
    </g>
  </g>
</template>
