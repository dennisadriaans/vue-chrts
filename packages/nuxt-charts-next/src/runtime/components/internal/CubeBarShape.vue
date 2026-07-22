<script setup lang="ts">
/**
 * One cube-grid column (or stacked segment) for `BarChart` `variant="cubes"`.
 *
 * Rendered through the `vccs` `<Bar>` `#shape` slot. Uses the entry's
 * `background` band for the full ghost tower and the bar segment (`y`/`height`)
 * for which cells this series fills.
 */
import { computed } from "vue";
import {
  DEFAULT_CUBE_EMPTY_COLOR,
  DEFAULT_CUBE_GAP,
  DEFAULT_CUBE_RADIUS,
  DEFAULT_CUBE_SIZE,
  layoutCubeColumn,
  type CubeColumnBand,
} from "../../utils/cubes";

const props = withDefaults(
  defineProps<{
    x?: number | null;
    y?: number | null;
    width?: number;
    height?: number;
    background?: CubeColumnBand | null;
    fill?: string;
    gap?: number;
    radius?: number;
    preferredSize?: number;
    emptyColor?: string;
    /** When false, only filled cubes are emitted (stacked layers above the first). */
    includeEmpty?: boolean;
  }>(),
  {
    gap: DEFAULT_CUBE_GAP,
    radius: DEFAULT_CUBE_RADIUS,
    preferredSize: DEFAULT_CUBE_SIZE,
    emptyColor: DEFAULT_CUBE_EMPTY_COLOR,
    includeEmpty: true,
  },
);

const cubes = computed(() => {
  const column =
    props.background && props.background.width > 0 && props.background.height > 0
      ? props.background
      : props.x != null &&
          props.y != null &&
          (props.width ?? 0) > 0 &&
          (props.height ?? 0) > 0
        ? {
            x: props.x,
            y: props.y,
            width: props.width!,
            height: props.height!,
          }
        : null;

  if (!column) return [];

  return layoutCubeColumn({
    column,
    valueHeight: Math.max(0, props.height ?? 0),
    segmentY: props.background ? (props.y ?? undefined) : undefined,
    includeEmpty: props.includeEmpty,
    gap: props.gap,
    radius: props.radius,
    preferredSize: props.preferredSize,
  });
});
</script>

<template>
  <g class="vc-cube-bar">
    <rect
      v-for="(cube, i) in cubes"
      :key="i"
      :x="cube.x"
      :y="cube.y"
      :width="cube.size"
      :height="cube.size"
      :rx="cube.radius"
      :ry="cube.radius"
      :fill="cube.filled ? (fill ?? 'currentColor') : emptyColor"
    />
  </g>
</template>
