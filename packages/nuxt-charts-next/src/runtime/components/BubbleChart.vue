<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * Bubble chart adapter (maps onto the `vccs` Scatter chart).
 *
 * Accepts the `nuxt-charts` v2 `BubbleChartProps` config API and composes
 * `<ScatterChart>` with x / y / z axes bound to the accessor keys, plus one
 * `<Scatter>` series per distinct value of `categoryKey` (colour-coded via
 * `categories`).
 */
import { computed, h } from "vue";
import {
  CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from "vccs";
import type { TooltipContentProps } from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartSkeleton from "./internal/ChartSkeleton.vue";
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

const slots = defineSlots<{
  tooltip?: (props: { values: T | undefined }) => unknown;
}>();

/** Keep function accessors intact — `String(fn)` breaks v2 site/block usage. */
function resolveAccessor(accessor: BubbleChartProps<T>["xAccessor"] | undefined) {
  if (accessor === undefined) return undefined;
  return typeof accessor === "function" ? accessor : String(accessor);
}

/**
 * Human-readable name for an accessor, used as the axis/tooltip label.
 *
 * `vccs` falls back to `String(dataKey)`, which prints the whole function source
 * (`(d) => d.month`) for the v2 function accessors. Field names survive
 * minification, so a single-expression accessor is read back from its source;
 * anything else falls back to the axis name.
 */
function accessorName(
  accessor: BubbleChartProps<T>["xAccessor"] | undefined,
  fallback: string,
) {
  if (accessor === undefined) return fallback;
  if (typeof accessor !== "function") return String(accessor);
  const match = /(?:=>|return)\s*[\w$]+(?:\?\.|\.)([\w$]+)\s*;?\s*\}?\s*$/.exec(String(accessor));
  return match?.[1] ?? fallback;
}

const xKey = computed(() => resolveAccessor(props.xAccessor)!);
const yKey = computed(() => resolveAccessor(props.yAccessor)!);
const zKey = computed(() => resolveAccessor(props.sizeAccessor));
const categoryKey = computed(() => String(props.categoryKey));

const xName = computed(() => props.xLabel ?? accessorName(props.xAccessor, "x"));
const yName = computed(() => props.yLabel ?? accessorName(props.yAccessor, "y"));
const zName = computed(() => accessorName(props.sizeAccessor, "size"));

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

const colorByCategory = computed(() => {
  const map = new Map<string, string | undefined>();
  for (const s of categoriesToSeries(props.categories)) map.set(s.dataKey, s.color);
  return map;
});

/** Split the rows into one Scatter series per categoryKey value, coloured from `categories`. */
const groups = computed(() => {
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
    color: colorByCategory.value.get(name),
  }));
});

/**
 * `vccs` builds one scatter tooltip row per axis, named `String(axis.dataKey)`
 * and stripped of the series colour. Re-label the rows from the accessors, run
 * the axis formatters over the values, and title the tooltip with the category.
 */
const tooltipContent = computed(() => {
  const fields = [
    { key: xKey.value, name: xName.value, format: xTickFormatter.value },
    { key: yKey.value, name: yName.value, format: yTickFormatter.value },
    ...(zKey.value ? [{ key: zKey.value, name: zName.value, format: undefined }] : []),
  ];

  return (tooltipProps: TooltipContentProps) => {
    const row = tooltipProps.payload?.[0]?.payload as T | undefined;
    if (slots.tooltip) return slots.tooltip({ values: row });

    const category = row != null ? String(row[categoryKey.value]) : undefined;
    const color = category != null ? colorByCategory.value.get(category) : undefined;

    const payload = (tooltipProps.payload ?? []).map((entry) => {
      const field = fields.find((f) => f.key === entry.dataKey);
      return {
        ...entry,
        color,
        name: field?.name ?? entry.name,
        value: field?.format ? field.format(entry.value, 0) : entry.value,
      };
    });

    return h(ChartTooltip, {
      ...tooltipProps,
      label: category,
      payload,
      variant: props.tooltipVariant,
      roundness: props.tooltipRoundness,
    });
  };
});
</script>

<template>
  <div class="vue-chrts" :style="themeVars">
  <ChartSkeleton
    v-if="loading"
    :height="height"
    shape="bars"
    :label="loadingLabel ?? 'Loading'"
  />
  <ChartContainer v-else width="100%" :height="height">
    <ScatterChart>
      <CartesianGrid
        v-if="(xGridLine ?? true) || (yGridLine ?? true)"
        :horizontal="yGridLine ?? true"
        :vertical="xGridLine ?? true"
        stroke="var(--vc-grid-color)"
        stroke-dasharray="var(--vc-grid-dash)"
        :stroke-width="'var(--vc-grid-width)'"
      />
      <!-- Axes stay mounted when hidden: their `dataKey` is what maps rows to x/y. -->
      <XAxis
        type="number"
        :data-key="xKey"
        :hide="hideXAxis"
        :name="xName"
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
        type="number"
        :data-key="yKey"
        :hide="hideYAxis"
        :name="yName"
        :width="yAxisWidth"
        :tick="yTickProp"
        :tick-margin="AXIS_TICK_MARGIN.y"
        :tick-line="yTickLineProp"
        :axis-line="axisLineStyle"
        :tick-formatter="yTickFormatter"
        :domain="yAxisDomain"
        :interval="yAxis.interval"
      />
      <ZAxis v-if="zKey" type="number" :data-key="zKey" :name="zName" :range="sizeRange" />

      <!-- Distinct `dataKey` per series: `vccs` filters the item tooltip and the -->
      <!-- active-symbol highlight by it, so shared keys show every series at once. -->
      <Scatter
        v-for="g in groups"
        :key="g.name"
        :data-key="g.name"
        :name="g.name"
        :data="g.data"
        :fill="g.color"
        :fill-opacity="opacity ?? 0.7"
      />

      <Tooltip v-if="!hideTooltip" :content="tooltipContent" :cursor="cursor" :is-animation-active="false" />
      <Legend
        v-if="!hideLegend"
        :align="legend.align"
        :vertical-align="legend.verticalAlign"
        :layout="legend.layout"
        :wrapper-style="legendWrapperStyle"
      >
        <template #content="slotProps">
          <ChartLegend v-bind="slotProps" :variant="legendVariant" />
        </template>
      </Legend>
    </ScatterChart>
  </ChartContainer>
  </div>
</template>
