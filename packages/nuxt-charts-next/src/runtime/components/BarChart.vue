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
import { computed } from "vue";
import { Bar, BarChart as VccsBarChart, LabelList, Rectangle } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import CubeBarShape from "./internal/CubeBarShape.vue";
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
  <CartesianFrame :container="VccsBarChart" :x-axis-key="xAxisKey" v-bind="props">
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
          :empty-color="cubeEmptyColor"
          :include-empty="!stacked || i === 0"
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
