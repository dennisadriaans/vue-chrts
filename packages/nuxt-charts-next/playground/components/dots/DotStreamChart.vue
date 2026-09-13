<script setup lang="ts">
/**
 * Stream chart in dots — a column of dots centred on a mid-line, growing
 * symmetrically outward with the value.
 *
 * Reads like a waveform or a ridge: the silhouette comes from dot count on
 * each side of the axis, with no outline drawn. Dots fade toward the outer
 * edge so the dense core traces the trend.
 */
import { computed } from "vue";
import { fadeAt, maxOf, type DotPoint } from "./geometry";

const props = withDefaults(
  defineProps<{
    data: DotPoint[];
    height?: number;
    /** Diameter of one dot, in px. */
    dotSize?: number;
    /** Vertical spacing between dots in a column, in px. */
    step?: number;
    /** Horizontal spacing between columns, in px. */
    stride?: number;
    color?: string;
    /** Opacity of the outermost dot in a column. */
    minOpacity?: number;
  }>(),
  {
    height: 200,
    dotSize: 4,
    step: 7,
    stride: 12,
    color: "currentColor",
    minOpacity: 0.15,
  },
);

const viewWidth = computed(() =>
  Math.max(props.stride, props.data.length * props.stride),
);

const viewHeight = computed(() => props.height);
const midY = computed(() => viewHeight.value / 2);

/** Dots available from the mid-line out to one edge. */
const maxPerSide = computed(() =>
  Math.max(1, Math.floor((viewHeight.value / 2 - props.dotSize) / props.step)),
);

const max = computed(() => maxOf(props.data));

interface Column {
  key: string;
  cx: number;
  dots: { cy: number; opacity: number }[];
}

const columns = computed<Column[]>(() =>
  props.data.map((point, index) => {
    const cx = index * props.stride + props.stride / 2;
    const value = point.value ?? 0;
    const perSide = Math.max(
      1,
      Math.round((value / max.value) * maxPerSide.value),
    );

    const dots: { cy: number; opacity: number }[] = [];
    for (let i = 0; i < perSide; i++) {
      // t is 0 at the mid-line, 1 at this column's outermost dot.
      const t = perSide > 1 ? i / (perSide - 1) : 0;
      const offset = i * props.step;
      const opacity = fadeAt(t, props.minOpacity);

      dots.push({ cy: midY.value - offset, opacity });
      // Skip the duplicate at the centre when offset is 0.
      if (offset > 0) dots.push({ cy: midY.value + offset, opacity });
    }

    return { key: `${point.label}-${index}`, cx, dots };
  }),
);
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    :height="height"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Dotted stream chart"
  >
    <g :fill="color">
      <template v-for="column in columns" :key="column.key">
        <circle
          v-for="(dot, i) in column.dots"
          :key="i"
          :cx="column.cx"
          :cy="dot.cy"
          :r="dotSize / 2"
          :fill-opacity="dot.opacity"
        />
      </template>
    </g>
  </svg>
</template>
