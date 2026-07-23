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
    /** When set below preferredSize, cubes shrink from top → bottom. */
    minSize?: number;
    /** Floor opacity when size-tapering (top = 1). Default 0.05. */
    minOpacity?: number;
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
  const hasBackground =
    props.background && props.background.width > 0 && props.background.height > 0;
  const hasBar =
    props.x != null &&
    props.y != null &&
    (props.width ?? 0) > 0 &&
    (props.height ?? 0) > 0;

  // Vertical band from background (full plot height); horizontal slot from the
  // bar itself so grouped/stacked columns stay centered on their own axis.
  const column =
    hasBackground && hasBar
      ? {
          x: props.x!,
          y: props.background!.y,
          width: props.width!,
          height: props.background!.height,
        }
      : hasBackground
        ? props.background!
        : hasBar
          ? {
              x: props.x!,
              y: props.y!,
              width: props.width!,
              height: props.height!,
            }
          : null;

  if (!column) return [];

  return layoutCubeColumn({
    column,
    valueHeight: Math.max(0, props.height ?? 0),
    segmentY: hasBackground ? (props.y ?? undefined) : undefined,
    includeEmpty: props.includeEmpty,
    gap: props.gap,
    radius: props.radius,
    preferredSize: props.preferredSize,
    minSize: props.minSize,
    minOpacity: props.minOpacity,
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
      :fill-opacity="cube.opacity"
    />
  </g>
</template>
