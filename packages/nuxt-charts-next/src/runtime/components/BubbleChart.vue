<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * Bubble chart adapter (maps onto the `vccs` Scatter chart).
 *
 * Accepts the `nuxt-charts` v2 `BubbleChartProps` config API and composes
 * `<ScatterChart>` with x / y / z axes bound to the accessor keys, plus one
 * `<Scatter>` series per distinct value of `categoryKey` (colour-coded via
 * `categories`).
 */
import { computed } from "vue";
import {
  CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from "vccs";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import type { BubbleChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps } from "../utils/legend";
import { resolveAxisProps, toTickFormatter } from "../utils/axis";
import { toAxisDomain, toCssProperties } from "../utils/style";

const props = defineProps<BubbleChartProps<T>>();

const xKey = computed(() => String(props.xAccessor));
const yKey = computed(() => String(props.yAccessor));
const zKey = computed(() => (props.sizeAccessor !== undefined ? String(props.sizeAccessor) : undefined));
const categoryKey = computed(() => String(props.categoryKey));

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const sizeRange = computed(() => props.sizeRange ?? [props.sizeOptions?.minRadius ?? 1, props.sizeOptions?.maxRadius ?? 20]);

const xTickFormatter = computed(() => toTickFormatter(props.xFormatter));
const yTickFormatter = computed(() => toTickFormatter(props.yFormatter));
const xAxisDomain = computed(() => toAxisDomain(props.xDomain));
const yAxisDomain = computed(() => toAxisDomain(props.yDomain));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));

const xAxis = computed(() =>
  resolveAxisProps(props.xExplicitTicks, props.xAxisConfig, props.minMaxTicksOnly),
);
const yAxis = computed(() => resolveAxisProps(undefined, props.yAxisConfig, props.minMaxTicksOnly));

/** Split the rows into one Scatter series per categoryKey value, coloured from `categories`. */
const groups = computed(() => {
  const colorByCat = new Map<string, string | undefined>();
  for (const s of categoriesToSeries(props.categories)) colorByCat.set(s.dataKey, s.color);

  const byCategory = new Map<string, T[]>();
  for (const row of props.data) {
    const cat = String(row[categoryKey.value]);
    const bucket = byCategory.get(cat);
    if (bucket) bucket.push(row);
    else byCategory.set(cat, [row]);
  }

  return Array.from(byCategory.entries()).map(([name, data]) => ({
    name,
    data,
    color: colorByCat.get(name),
  }));
});
</script>

<template>
  <ResponsiveContainer width="100%" :height="height">
    <ScatterChart>
      <CartesianGrid v-if="(xGridLine ?? true) || (yGridLine ?? true)" stroke-dasharray="3 3" />
      <XAxis
        v-if="!hideXAxis"
        type="number"
        :data-key="xKey"
        :name="xLabel"
        :tick-line="xAxisConfig?.tickLine ?? xTickLine ?? false"
        :tick-formatter="xTickFormatter"
        :domain="xAxisDomain"
        :ticks="xAxis.ticks"
        :interval="xAxis.interval"
        :tick="xAxis.tick ?? true"
      />
      <YAxis
        v-if="!hideYAxis"
        type="number"
        :data-key="yKey"
        :name="yLabel"
        :tick-line="yAxisConfig?.tickLine ?? yTickLine ?? false"
        :tick-formatter="yTickFormatter"
        :domain="yAxisDomain"
        :interval="yAxis.interval"
        :tick="yAxis.tick ?? true"
      />
      <ZAxis v-if="zKey" type="number" :data-key="zKey" :range="sizeRange" />

      <Scatter
        v-for="g in groups"
        :key="g.name"
        :name="g.name"
        :data="g.data"
        :fill="g.color"
        :fill-opacity="opacity ?? 0.7"
      />

      <Tooltip v-if="!hideTooltip" :content="ChartTooltip" :is-animation-active="false" />
      <Legend
        v-if="!hideLegend"
        :align="legend.align"
        :vertical-align="legend.verticalAlign"
        :layout="legend.layout"
        :wrapper-style="legendWrapperStyle"
      >
        <template #content="slotProps">
          <ChartLegend v-bind="slotProps" />
        </template>
      </Legend>
    </ScatterChart>
  </ResponsiveContainer>
</template>
