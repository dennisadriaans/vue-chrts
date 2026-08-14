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
  CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import type { BubbleChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import {
  AXIS_TICK_MARGIN,
  resolveAxisProps,
  resolveXAxisHeight,
  resolveYAxisWidth,
  toTickFormatter,
  toTickProp,
} from "../utils/axis";
import { toAxisDomain, toCssProperties } from "../utils/style";
import { axisTickVars, resolveHoverRadius, resolveHoverVisible, themeToVars } from "../utils/theme";

const props = defineProps<BubbleChartProps<T>>();

/** Keep function accessors intact — `String(fn)` breaks v2 site/block usage. */
function resolveAccessor(accessor: BubbleChartProps<T>["xAccessor"] | undefined) {
  if (accessor === undefined) return undefined;
  return typeof accessor === "function" ? accessor : String(accessor);
}

const xKey = computed(() => resolveAccessor(props.xAccessor)!);
const yKey = computed(() => resolveAccessor(props.yAccessor)!);
const zKey = computed(() => resolveAccessor(props.sizeAccessor));
const categoryKey = computed(() => String(props.categoryKey));

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const sizeRange = computed(() => {
  if (props.sizeRange) return props.sizeRange;
  // sizeOptions used radius in v2; ZAxis expects an area-like pixel range.
  const min = props.sizeOptions?.minRadius;
  const max = props.sizeOptions?.maxRadius;
  if (min !== undefined || max !== undefined) {
    const rMin = min ?? 4;
    const rMax = max ?? 20;
    return [Math.PI * rMin * rMin, Math.PI * rMax * rMax] as [number, number];
  }
  return [60, 400] as [number, number];
});

const xTickFormatter = computed(() => toTickFormatter(props.xFormatter));
const yTickFormatter = computed(() => toTickFormatter(props.yFormatter));
const xAxisDomain = computed(() => toAxisDomain(props.xDomain));
const yAxisDomain = computed(() => toAxisDomain(props.yDomain));
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);

const xAxis = computed(() =>
  resolveAxisProps(props.xExplicitTicks, props.xAxisConfig, props.minMaxTicksOnly),
);
const yAxis = computed(() => resolveAxisProps(undefined, props.yAxisConfig, props.minMaxTicksOnly));

const xAxisHeight = computed(() => resolveXAxisHeight({ hasTitle: !!props.xLabel }));
const yAxisWidth = computed(() =>
  resolveYAxisWidth({ hasTitle: !!props.yLabel, isCategoryAxis: false }),
);

const themeVars = computed(() => ({
  ...themeToVars(props.theme),
  ...axisTickVars("x", xAxis.value.tick),
  ...axisTickVars("y", yAxis.value.tick),
}));

const xTickProp = computed(() => toTickProp(xAxis.value.tick));
const yTickProp = computed(() => toTickProp(yAxis.value.tick));

/** Token-driven grid / axis-line presentation (mirrors CartesianFrame). */
const axisLineStyle = { stroke: "var(--vc-axis-line-color)" } as const;
const xTickLineProp = computed(() =>
  (props.xAxisConfig?.tickLine ?? props.xTickLine ?? false) ? axisLineStyle : false,
);
const yTickLineProp = computed(() =>
  (props.yAxisConfig?.tickLine ?? props.yTickLine ?? false) ? axisLineStyle : false,
);
const cursor = computed(() =>
  resolveHoverVisible(props.theme)
    ? {
        fill: "var(--vc-hover-fill)",
        stroke: "var(--vc-hover-stroke)",
        radius: resolveHoverRadius(props.theme),
      }
    : false,
);

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
  <div class="vue-chrts" :style="themeVars">
  <ChartContainer width="100%" :height="height">
    <ScatterChart>
      <CartesianGrid
        v-if="(xGridLine ?? true) || (yGridLine ?? true)"
        stroke="var(--vc-grid-color)"
        stroke-dasharray="var(--vc-grid-dash)"
        :stroke-width="'var(--vc-grid-width)'"
      />
      <XAxis
        v-if="!hideXAxis"
        type="number"
        :data-key="xKey"
        :name="xLabel"
        :height="xAxisHeight"
        :tick="xTickProp"
        :tick-margin="AXIS_TICK_MARGIN.x"
        :tick-line="xTickLineProp"
        :axis-line="axisLineStyle"
        :tick-formatter="xTickFormatter"
        :domain="xAxisDomain"
        :ticks="xAxis.ticks"
        :interval="xAxis.interval"
      />
      <YAxis
        v-if="!hideYAxis"
        type="number"
        :data-key="yKey"
        :name="yLabel"
        :width="yAxisWidth"
        :tick="yTickProp"
        :tick-margin="AXIS_TICK_MARGIN.y"
        :tick-line="yTickLineProp"
        :axis-line="axisLineStyle"
        :tick-formatter="yTickFormatter"
        :domain="yAxisDomain"
        :interval="yAxis.interval"
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

      <Tooltip v-if="!hideTooltip" :content="ChartTooltip" :cursor="cursor" :is-animation-active="false" />
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
  </ChartContainer>
  </div>
</template>
