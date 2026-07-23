<script setup lang="ts" generic="T">
/**
 * Bar chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `BarChartProps` config API and composes the
 * `vccs` `<BarChart>` + one `<Bar>` per series. Series come from `yAxis`
 * (the value keys); `categories` supplies each series' colour and label.
 *
 * `variant="cubes"` swaps the default rectangle for a cube-grid column
 * ({@link CubeBarShape}). Supports single, grouped, and stacked series.
 */
import { computed, useId } from "vue";
import { Bar, BarChart as VccsBarChart, LabelList, Rectangle } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import CubeBarShape from "./internal/CubeBarShape.vue";
import HalftoneBarShape from "./internal/HalftoneBarShape.vue";
import HalftoneDefs from "./internal/HalftoneDefs";
import type { BarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import {
  DEFAULT_CUBE_EMPTY_COLOR,
  DEFAULT_CUBE_GAP,
  DEFAULT_CUBE_RADIUS,
  DEFAULT_CUBE_SIZE,
} from "../utils/cubes";

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  variant: "solid",
  cubeGap: DEFAULT_CUBE_GAP,
  cubeRadius: DEFAULT_CUBE_RADIUS,
  cubeSize: DEFAULT_CUBE_SIZE,
  cubeEmptyColor: DEFAULT_CUBE_EMPTY_COLOR,
});

const isCubes = computed(() => props.variant === "cubes");

/**
 * `variant="halftone"` paints each column with a 1-bit ordered dither that runs
 * solid on the baseline to sparse at the top, instead of a flat rectangle.
 */
const isHalftone = computed(() => props.variant === "halftone");

/** Scope for the lattice `<defs>`; per chart instance so ids never collide. */
const halftoneScope = useId();

/** How many discrete coverage levels each column is sliced into. */
const HALFTONE_STEPS = 14;

/** One level set per series — the lattice is painted in the series colour. */
function halftoneSeriesScope(dataKey: string): string {
  return `${halftoneScope}-${dataKey}`;
}

/**
 * Adapt the v2 `valueLabel.label(d, index)` callback to the `vccs` `LabelList`
 * `valueAccessor(entry, index)`. v2 reads the value off `d.y`, so expose both
 * `y` and the raw `entry` fields to the user callback.
 */
const valueAccessor = computed(() => {
  const fn = props.valueLabel?.label;
  if (!fn) return undefined;
  return (
    entry: { value?: number | string | Array<number | string> },
    index: number,
  ): string | number => {
    const y = Array.isArray(entry.value) ? entry.value[entry.value.length - 1] : entry.value;
    return fn({ ...entry, y }, index);
  };
});

/** Index categories by key so a `yAxis` entry can look up its colour / label. */
const categoryByKey = computed(() => {
  const map = new Map<string, { name: string; color: string | undefined; hidden: boolean }>();
  for (const s of categoriesToSeries(props.categories)) map.set(s.dataKey, s);
  return map;
});

/** One descriptor per `yAxis` value key, enriched from `categories`. */
const series = computed(() =>
  props.yAxis.map((key) => {
    const k = String(key);
    const cat = categoryByKey.value.get(k);
    return {
      dataKey: k,
      name: cat?.name ?? k,
      color: cat?.color,
      hidden: cat?.hidden ?? false,
    };
  }),
);

const stackId = computed(() => (props.stacked ? "stack" : undefined));
const xAxisKey = computed(() => (props.xAxis !== undefined ? String(props.xAxis) : undefined));

/** Forward spacing props onto the `vccs` chart container. */
const chartContainerProps = computed(() => {
  const barGap = props.barGap ?? props.barPadding;
  const barCategoryGap = props.barCategoryGap ?? props.groupPadding;
  return {
    ...(barGap !== undefined ? { barGap } : {}),
    ...(barCategoryGap !== undefined ? { barCategoryGap } : {}),
  };
});

/**
 * Only the outer edge of a stack gets rounded corners; inner segment joins
 * stay square. `radius` order is `[top-left, top-right, bottom-right, bottom-left]`.
 */
function barRadius(index: number): number | [number, number, number, number] {
  const r = props.radius ?? 2;
  if (!props.stacked) return r;
  const isLast = index === series.value.length - 1;
  if (props.orientation === "horizontal") {
    return isLast ? [0, r, r, 0] : 0;
  }
  return isLast ? [r, r, 0, 0] : 0;
}
</script>

<template>
  <CartesianFrame
    :container="VccsBarChart"
    :x-axis-key="xAxisKey"
    :container-props="chartContainerProps"
    v-bind="props"
  >
    <!--
      One lattice level set per series. Built with `h()` (see HalftoneDefs) so
      the patterns land in the SVG namespace; do not wrap in vccs `<Customized>`,
      which re-renders on every tooltip mousemove and would rebuild them all.
    -->
    <HalftoneDefs
      v-for="s in isHalftone ? series : []"
      :key="`ht-${s.dataKey}`"
      :scope="halftoneSeriesScope(s.dataKey)"
      :color="s.color"
      :cell="halftoneCell ?? 2"
      :steps="HALFTONE_STEPS"
      :from="halftoneFrom ?? 0"
      :to="halftoneTo ?? 1"
      :bias="halftoneBias ?? 1"
    />
    <Bar
      v-for="(s, i) in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :stack-id="stackId"
      :fill="s.color"
      :radius="isCubes ? 0 : barRadius(i)"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
    >
      <!--
        Always register `#shape`. vccs reads `slots.shape` once in Bar setup, so a
        `v-if` on the slot means switching solid→cubes never picks up the cube renderer.
      -->
      <template #shape="shapeProps">
        <CubeBarShape
          v-if="isCubes"
          :x="shapeProps.x"
          :y="shapeProps.y"
          :width="shapeProps.width"
          :height="shapeProps.height"
          :background="shapeProps.background"
          :fill="shapeProps.fill ?? s.color"
          :gap="cubeGap"
          :radius="cubeRadius"
          :preferred-size="cubeSize"
          :min-size="typeof cubeMinSize === 'number' ? cubeMinSize : undefined"
          :min-opacity="typeof cubeMinOpacity === 'number' ? cubeMinOpacity : undefined"
          :empty-color="cubeEmptyColor"
          :include-empty="!stacked || i === 0"
        />
        <HalftoneBarShape
          v-else-if="isHalftone"
          :x="shapeProps.x"
          :y="shapeProps.y"
          :width="shapeProps.width"
          :height="shapeProps.height"
          :fill="shapeProps.fill ?? s.color"
          :scope="halftoneSeriesScope(s.dataKey)"
          :steps="HALFTONE_STEPS"
          :cap-height="halftoneCap ?? 3"
          :radius="typeof barRadius(i) === 'number' ? (barRadius(i) as number) : 0"
        />
        <Rectangle v-else v-bind="shapeProps" />
      </template>
      <LabelList
        v-if="valueLabel && !isCubes"
        :data-key="s.dataKey"
        :value-accessor="valueAccessor"
        :position="orientation === 'horizontal' ? 'right' : 'top'"
        :offset="valueLabel.labelSpacing ?? 8"
        :font-size="valueLabel.labelFontSize ?? 12"
        :fill="valueLabel.color ?? 'currentColor'"
      />
    </Bar>
  </CartesianFrame>
</template>
