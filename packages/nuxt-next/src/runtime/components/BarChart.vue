<script setup lang="ts" generic="T">
/**
 * Bar chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `BarChartProps` config API and composes the
 * `vccs` `<BarChart>` + one `<Bar>` per series. Series come from `yAxis`
 * (the value keys); `categories` supplies each series' colour and label.
 */
import { computed } from "vue";
import { Bar, BarChart as VccsBarChart } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import type { BarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";

const props = defineProps<BarChartProps<T>>();

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
</script>

<template>
  <CartesianFrame :container="VccsBarChart" :x-axis-key="xAxisKey" v-bind="props">
    <Bar
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :stack-id="stackId"
      :fill="s.color"
      :radius="radius ?? 2"
      :hide="s.hidden"
      :is-animation-active="duration !== 0"
    />
  </CartesianFrame>
</template>
