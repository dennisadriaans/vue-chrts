<script setup lang="ts" generic="T">
/**
 * Bar chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `BarChartProps` config API and composes the
 * `vccs` `<BarChart>` + one `<Bar>` per series. Series come from `yAxis`
 * (the value keys); `categories` supplies each series' colour and label.
 *
 * `variant` picks how a bar is drawn: `"cubes"` swaps the rectangle for a
 * cube-grid column ({@link CubeBarShape}), while the patterned variants keep
 * the rectangle and paint it from a generated `<defs>` fill
 * ({@link BarVariantDefs}). All of them support single, grouped and stacked
 * series.
 */
import { computed, ref, useId } from "vue";
import { Bar, BarChart as VccsBarChart, LabelList, Rectangle } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import CubeBarShape from "./internal/CubeBarShape.vue";
import VariantBarShape from "./internal/VariantBarShape.vue";
import BarVariantDefs from "./internal/BarVariantDefs";
import type { BarChartProps } from "../types/charts";
import type { AxisId } from "../types/shared";
import {
  categoriesToSeries,
  PRIMARY_Y_AXIS_ID,
  type SeriesDescriptor,
} from "../utils/categories";
import {
  DEFAULT_CUBE_EMPTY_COLOR,
  DEFAULT_CUBE_GAP,
  DEFAULT_CUBE_RADIUS,
  DEFAULT_CUBE_SIZE,
} from "../utils/cubes";
import { PATTERNED_BAR_VARIANTS, variantId } from "../utils/variants";

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  variant: "solid",
  cubeGap: DEFAULT_CUBE_GAP,
  cubeRadius: DEFAULT_CUBE_RADIUS,
  cubeSize: DEFAULT_CUBE_SIZE,
  cubeEmptyColor: DEFAULT_CUBE_EMPTY_COLOR,
});

/** Scopes this chart's `<defs>` ids so several charts on a page never collide. */
const variantScope = useId();

const isCubes = computed(() => props.variant === "cubes");
/** Whether the bars paint from a generated pattern rather than a flat colour. */
const isPatterned = computed(() => PATTERNED_BAR_VARIANTS.includes(props.variant));
const isStripped = computed(() => props.variant === "stripped");

/**
 * A custom `#shape` is only worth its cost when something about the bar's
 * geometry actually changes; the plain variants stay on the `vccs` rectangle.
 */
const usesVariantShape = computed(
  () => isStripped.value || props.bufferBar === true || props.glow === true,
);

/**
 * Index of the row the pointer is over, or `null`. Only tracked when
 * `hoverHighlight` is on, so the default chart does no work per mousemove.
 */
const hoveredIndex = ref<number | null>(null);

/** Row index of the final bar — the one `bufferBar` renders as a projection. */
const lastIndex = computed(() => props.data.length - 1);

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
  const map = new Map<string, SeriesDescriptor>();
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
      yAxisId: cat?.yAxisId ?? PRIMARY_Y_AXIS_ID,
    };
  }),
);

/** Series narrowed to those with a resolved colour, which the `<defs>` need. */
const paintedSeries = computed(() =>
  series.value
    .filter((s) => typeof s.color === "string")
    .map((s) => ({ dataKey: s.dataKey, color: s.color as string })),
);

/** Resolve the `fill` for one series: a variant pattern, or its flat colour. */
function fillFor(dataKey: string, color: string | undefined): string | undefined {
  if (!isPatterned.value || color === undefined) return color;
  return `url(#${variantId(props.variant, dataKey, variantScope)})`;
}

/** `url(#…)` of the hollow hatch a projection bar paints from. */
function bufferFillFor(dataKey: string): string {
  return `url(#${variantId("buffer", dataKey, variantScope)})`;
}

/** `url(#…)` of the outer-glow filter, or `undefined` when the series does not glow. */
function glowFor(dataKey: string): string | undefined {
  return props.glow ? `url(#${variantId("glow", dataKey, variantScope)})` : undefined;
}

/**
 * Opacity for one bar under `hoverHighlight`: the hovered column keeps full
 * strength and the rest drop back. Every bar stays fully opaque while the
 * pointer is outside the plot, so the chart's resting state is unaffected.
 */
function opacityFor(index: number | undefined): number {
  if (!props.hoverHighlight || hoveredIndex.value === null) return 1;
  return index === hoveredIndex.value ? 1 : 0.3;
}

/**
 * Track the hovered column. Bound per bar rather than on the container so it
 * does not depend on the `vccs` container forwarding DOM listeners.
 */
function onBarEnter(index: number | undefined) {
  if (props.hoverHighlight) hoveredIndex.value = index ?? null;
}

function onBarLeave() {
  if (props.hoverHighlight) hoveredIndex.value = null;
}

/**
 * Stacking is per-axis: series on different y-axes plot against different scales,
 * so summing them into one stack would be meaningless. Each axis gets its own
 * stack id; single-axis charts keep a single `stack-0` group as before.
 */
const stackIdFor = (yAxisId: AxisId) => (props.stacked ? `stack-${yAxisId}` : undefined);
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
 *
 * A stripped bar rounds its top corners only — the flat foot lets the faint
 * body sit on the axis while the cap strip above carries the value.
 */
function barRadius(index: number): number | [number, number, number, number] {
  const r = props.radius ?? 2;
  const horizontal = props.orientation === "horizontal";

  if (isStripped.value && !props.stacked) {
    return horizontal ? [0, r, r, 0] : [r, r, 0, 0];
  }
  if (!props.stacked) return r;

  const isLast = index === series.value.length - 1;
  if (horizontal) return isLast ? [0, r, r, 0] : 0;
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
      Same namespace/`Customized` constraints as GradientDefs: these are built
      with `h()` so they land in the SVG namespace and `url(#…)` resolves.
    -->
    <BarVariantDefs
      v-if="isPatterned || glow || bufferBar"
      :series="paintedSeries"
      :variant="variant"
      :scope="variantScope"
      :glow="glow === true"
      :buffer="bufferBar === true"
    />
    <Bar
      v-for="(s, i) in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :y-axis-id="s.yAxisId"
      :stack-id="stackIdFor(s.yAxisId)"
      :fill="fillFor(s.dataKey, s.color)"
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
        <VariantBarShape
          v-else-if="usesVariantShape"
          :x="shapeProps.x"
          :y="shapeProps.y"
          :width="shapeProps.width"
          :height="shapeProps.height"
          :radius="barRadius(i)"
          :fill="shapeProps.fill ?? s.color"
          :color="s.color"
          :capped="isStripped"
          :is-buffer="bufferBar === true && shapeProps.index === lastIndex"
          :buffer-fill="bufferFillFor(s.dataKey)"
          :filter="glowFor(s.dataKey)"
          :opacity="opacityFor(shapeProps.index)"
          @mouseenter="onBarEnter(shapeProps.index)"
          @mouseleave="onBarLeave"
        />
        <Rectangle
          v-else
          v-bind="shapeProps"
          :opacity="opacityFor(shapeProps.index)"
          @mouseenter="onBarEnter(shapeProps.index)"
          @mouseleave="onBarLeave"
        />
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
