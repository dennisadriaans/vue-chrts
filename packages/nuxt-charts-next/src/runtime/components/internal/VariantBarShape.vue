<script setup lang="ts">
/**
 * One bar drawn with a style variant, rendered through the `vccs` `<Bar>`
 * `#shape` slot.
 *
 * Two variants need geometry, not just a different paint, which is why this
 * exists rather than a plain `<Rectangle :fill>`:
 *
 * - `stripped` rounds only the top corners and floats a solid cap strip a few
 *   pixels above the faint body, so the value reads off the cap while the body
 *   stays quiet.
 * - a buffer bar (the last column, marked as a projection) swaps to a hollow
 *   hatch and gains an outline, so it is legible as "not measured yet" rather
 *   than as a short bar.
 *
 * `Rectangle` comes from `vccs` so corner radii, negative bars and the active
 * (hovered) state stay consistent with the default bar.
 */
import { computed } from "vue";
import { Rectangle } from "vccs";

const props = withDefaults(
  defineProps<{
    x?: number | null;
    y?: number | null;
    width?: number;
    height?: number;
    /** Corner radius, in the `vccs` `Rectangle` form. */
    radius?: number | [number, number, number, number];
    /** Paint for the bar body — a flat colour or a `url(#…)` variant pattern. */
    fill?: string;
    /** Series colour, used for the cap strip and the buffer outline. */
    color?: string;
    /** Draws the floating cap strip above the body. */
    capped?: boolean;
    /** Renders this bar as a projection: hollow hatch plus an outline. */
    isBuffer?: boolean;
    /** Paint for a projection bar's hollow hatch. */
    bufferFill?: string;
    /** `url(#…)` of the outer-glow filter, when the series glows. */
    filter?: string;
    /** Bar opacity, so hover-highlight can dim the bars that are not hovered. */
    opacity?: number;
  }>(),
  {
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined,
    radius: undefined,
    fill: undefined,
    color: undefined,
    bufferFill: undefined,
    filter: undefined,
    opacity: 1,
  },
);

/** Gap in px between the cap strip and the body it floats above. */
const CAP_OFFSET = 4;
/** Thickness of the cap strip in px. */
const CAP_HEIGHT = 2;

/**
 * The body is trimmed by 3px so consecutive bars in a stack (and the cap strip
 * above a stripped bar) keep a visible seam instead of merging into one block.
 */
const bodyHeight = computed(() => Math.max(0, (props.height ?? 0) - 3));

const bodyFill = computed(() =>
  props.isBuffer ? (props.bufferFill ?? props.fill) : props.fill,
);

/** A cap only makes sense on a bar with a top edge inside the plot. */
const showCap = computed(
  () => props.capped && props.x != null && props.y != null && (props.width ?? 0) > 0,
);
</script>

<template>
  <g class="vc-variant-bar" :opacity="opacity">
    <Rectangle
      :x="x ?? undefined"
      :y="y ?? undefined"
      :width="width"
      :height="bodyHeight"
      :radius="radius"
      :fill="bodyFill"
      :filter="filter"
      :stroke="isBuffer ? color : undefined"
      :stroke-width="isBuffer ? 1 : undefined"
    />
    <rect
      v-if="showCap"
      :x="x ?? 0"
      :y="(y ?? 0) - CAP_OFFSET"
      :width="width"
      :height="CAP_HEIGHT"
      rx="1"
      ry="1"
      :fill="color"
    />
  </g>
</template>
