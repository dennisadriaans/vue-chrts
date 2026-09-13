<script setup lang="ts">
/**
 * A line chart drawn as dots only — no stroke between points.
 *
 * The x axis always spans every point in `data`, including those whose value
 * is `null`. A gap therefore stays reserved rather than collapsing, so a
 * series with data only in its middle renders as a dotted line floating in
 * the centre of the chart with empty space on both sides.
 *
 * Points with no value can still show a faint placeholder dot on the baseline
 * (`showEmpty`), which keeps the axis readable without implying a value.
 *
 * Over a long axis a point may also carry a `group` (a year, a quarter).
 * Consecutive points sharing a group get one centred label under their span,
 * which gives the axis a coarse reading to fall back on. Every point still
 * keeps its own label; the ones with no value are simply drawn fainter.
 */
import { computed } from "vue";
import { maxOf, minOf, type DotPoint } from "./geometry";

const props = withDefaults(
  defineProps<{
    data: DotPoint[];
    height?: number;
    /** Diameter of a data dot, in px. */
    dotSize?: number;
    color?: string;
    /** Draws a faint marker on the baseline where a point has no value. */
    showEmpty?: boolean;
    /** Opacity of those empty placeholder dots. */
    emptyOpacity?: number;
    /** Renders the x labels under the plot. */
    showLabels?: boolean;
  }>(),
  {
    height: 240,
    dotSize: 9,
    color: "currentColor",
    showEmpty: true,
    emptyOpacity: 0.14,
    showLabels: true,
  },
);

const COLUMN_STRIDE = 22;
/** Height reserved under the plot for the x labels. */
const AXIS_SPACE = 22;
/** Extra height reserved under those labels for a row of group labels. */
const GROUP_SPACE = 20;
/** Small enough that a dense axis (every month of several years) stays clear. */
const LABEL_FONT_SIZE = 9;
/** Label opacity where the point has a value, and where it has none. */
const LABEL_OPACITY = 0.75;
const MUTED_LABEL_OPACITY = 0.3;
const GROUP_FONT_SIZE = 12;
/** Breathing room above the tallest dot and below the lowest. */
const PLOT_INSET = 14;

/** True once any point declares a group, which adds the second label row. */
const hasGroups = computed(() =>
  props.data.some((point) => point.group != null),
);

const viewWidth = computed(() =>
  Math.max(COLUMN_STRIDE, props.data.length * COLUMN_STRIDE),
);

/** Total space under the plot: the label row, plus a group row when used. */
const axisSpace = computed(
  () => AXIS_SPACE + (hasGroups.value ? GROUP_SPACE : 0),
);

const plotHeight = computed(() =>
  Math.max(1, props.height - axisSpace.value - PLOT_INSET * 2),
);

const viewHeight = computed(() => props.height);

/** Baseline sits just above the labels — where empty markers rest. */
const baselineY = computed(() => PLOT_INSET + plotHeight.value);

/** The point labels sit right under the baseline, groups under those. */
const labelY = computed(() =>
  viewHeight.value - (hasGroups.value ? GROUP_SPACE + 6 : 6),
);

const max = computed(() => maxOf(props.data));
/** Anchor the scale at zero unless the series dips below it. */
const min = computed(() => Math.min(0, minOf(props.data)));

interface Plotted {
  /** Unique per slot: labels repeat once the axis spans several groups. */
  key: string;
  label: string;
  cx: number;
  cy: number | null;
}

const points = computed<Plotted[]>(() =>
  props.data.map((point, index) => {
    const cx = index * COLUMN_STRIDE + COLUMN_STRIDE / 2;
    const has = point.value != null && Number.isFinite(point.value);
    const span = max.value - min.value || 1;
    const cy = has
      ? baselineY.value - ((point.value! - min.value) / span) * plotHeight.value
      : null;

    return { key: `${index}-${point.label}`, label: point.label, cx, cy };
  }),
);

interface Group {
  label: string;
  cx: number;
  /** True when the group contains at least one value, so it can be emphasised. */
  filled: boolean;
}

/** One label per run of consecutive points sharing a group, centred on the run. */
const groups = computed<Group[]>(() => {
  const out: Group[] = [];
  let start = 0;

  props.data.forEach((point, index) => {
    const next = props.data[index + 1];
    if (next && next.group === point.group) return;
    if (point.group != null) {
      const run = props.data.slice(start, index + 1);
      out.push({
        label: point.group,
        cx: ((start + index + 1) / 2) * COLUMN_STRIDE,
        filled: run.some(
          (member) => member.value != null && Number.isFinite(member.value),
        ),
      });
    }
    start = index + 1;
  });

  return out;
});

/** Describes both the axis span and where the data actually sits. */
const ariaLabel = computed(() => {
  const filled = props.data.filter(
    (point) => point.value != null && Number.isFinite(point.value),
  ).length;
  const scope = groups.value.length
    ? `${groups.value.length} groups`
    : `${props.data.length} periods`;
  return `Dotted line chart across ${scope}, with values in ${filled} of ${props.data.length} periods`;
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    :height="height"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    :aria-label="ariaLabel"
  >
    <g :fill="color">
      <template v-for="point in points" :key="point.key">
        <circle
          v-if="point.cy != null"
          :cx="point.cx"
          :cy="point.cy"
          :r="dotSize / 2"
        />
        <circle
          v-else-if="showEmpty"
          :cx="point.cx"
          :cy="baselineY"
          :r="dotSize / 2"
          :fill-opacity="emptyOpacity"
        />
        <text
          v-if="showLabels"
          :x="point.cx"
          :y="labelY"
          text-anchor="middle"
          :font-size="LABEL_FONT_SIZE"
          :fill-opacity="point.cy != null ? LABEL_OPACITY : MUTED_LABEL_OPACITY"
        >
          {{ point.label }}
        </text>
      </template>

      <text
        v-for="group in showLabels ? groups : []"
        :key="`group-${group.label}`"
        :x="group.cx"
        :y="viewHeight - 4"
        text-anchor="middle"
        :font-size="GROUP_FONT_SIZE"
        font-weight="600"
        :fill-opacity="group.filled ? 0.8 : 0.3"
      >
        {{ group.label }}
      </text>
    </g>
  </svg>
</template>
