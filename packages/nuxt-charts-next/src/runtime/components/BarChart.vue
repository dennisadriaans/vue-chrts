<script setup lang="ts" generic="T">
/**
 * Bar chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `BarChartProps` config API and composes the
 * `vccs` `<BarChart>` + one `<Bar>` per series. Series come from `yAxis`
 * (the value keys); `categories` supplies each series' colour and label.
 */
import { computed } from "vue";
import { Bar, BarChart as VccsBarChart, LabelList } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import type { BarChartProps } from "../types/charts";
import {
  categoriesToSeries,
  PRIMARY_Y_AXIS_ID,
  type SeriesDescriptor,
} from "../utils/categories";

const props = defineProps<BarChartProps<T>>();

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

const stackId = computed(() => (props.stacked ? "stack" : undefined));
const xAxisKey = computed(() => (props.xAxis !== undefined ? String(props.xAxis) : undefined));
</script>

<template>
  <CartesianFrame :container="VccsBarChart" :x-axis-key="xAxisKey" v-bind="props">
    <Bar
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :y-axis-id="s.yAxisId"
      :stack-id="stackId"
      :fill="s.color"
      :radius="radius ?? 2"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
    >
      <LabelList
        v-if="valueLabel"
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
