<script setup lang="ts" generic="T">
/**
 * Shared scaffolding for the cartesian charts (area, bar, line, bubble).
 *
 * Renders the responsive container, the supplied `vccs` chart container, the
 * grid, axes, tooltip and legend from the v2 config props — leaving the series
 * (`<Area>` / `<Bar>` / `<Line>` / `<Scatter>`) to the default slot. This keeps
 * every chart adapter small and the axis/legend/tooltip wiring in one place.
 */
import { computed, type Component } from "vue";
import {
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "vccs";
import type { CartesianChartBaseProps } from "../../types/charts";
import type { Orientation } from "../../enums";
import { legendPositionToLegendProps } from "../../utils/legend";
import { resolveAxisProps, toTickFormatter, type VccsAxisInterval } from "../../utils/axis";
import { toAxisDomain, toCssProperties } from "../../utils/style";
import ChartTooltip from "./ChartTooltip.vue";
import ChartLegend from "./ChartLegend.vue";

const props = defineProps<
  CartesianChartBaseProps<T> & {
    /** The `vccs` chart container component to render (AreaChart, BarChart, …). */
    container: Component;
    /** Extra props forwarded to the `vccs` chart container. */
    containerProps?: Record<string, unknown>;
    /** Data key for the category (x) axis. */
    xAxisKey?: string;
    /** Bar/area orientation; drives the container `layout`. */
    orientation?: Orientation;
  }
>();

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));

const showXGrid = computed(() => props.xGridLine ?? true);
const showYGrid = computed(() => props.yGridLine ?? true);

/**
 * Map a category value back to its row index in `data`.
 *
 * `vccs` calls a *category* axis tick formatter with the category value (the
 * `dataKey` field, e.g. "Jan"), whereas a value / index axis is called with a
 * number. The v2 (Unovis) `BarChart` plotted bars on an index x-scale, so its
 * `xFormatter` received the row index as the first argument — and the existing
 * ecosystem relies on `(i) => data[i].field`. To preserve that contract on the
 * category axis we translate the value back to its index before calling the
 * user formatter (matching how `LineChart` / `AreaChart`, which have no
 * `dataKey`, are already called with the index).
 */
const categoryIndexByValue = computed(() => {
  const map = new Map<unknown, number>();
  if (props.xAxisKey === undefined) return map;
  props.data.forEach((row, i) => {
    map.set((row as Record<string, unknown>)[props.xAxisKey as string], i);
  });
  return map;
});

/**
 * Wrap the category-axis formatter so it receives the row index (v2 parity).
 * Only applies when an `xAxisKey` exists (bar charts); index-based charts
 * already get a numeric tick from `vccs`.
 */
function withCategoryIndex(fn: ReturnType<typeof toTickFormatter>) {
  if (!fn || props.xAxisKey === undefined) return fn;
  return (value: unknown, index: number) => {
    const i = categoryIndexByValue.value.get(value);
    return fn(i ?? value, i ?? index);
  };
}

/** vccs container layout: 'vertical' swaps the value/category axes for horizontal bars. */
const layout = computed<"horizontal" | "vertical">(() =>
  props.orientation === "horizontal" ? "vertical" : "horizontal",
);

const rawXFormatter = computed(() =>
  toTickFormatter(props.xFormatter ?? props.xAxisConfig?.tickFormat),
);
const rawYFormatter = computed(() =>
  toTickFormatter(props.yFormatter ?? props.yAxisConfig?.tickFormat),
);

/**
 * Resolve which user formatter feeds the category axis vs the value axis,
 * matching v2 semantics: with vertical bars the x-axis is the category axis
 * (so `xFormatter` formats categories); with horizontal bars the category axis
 * is the y-axis, so `yFormatter` formats categories. The category-axis
 * formatter is wrapped with the index translation; the value-axis formatter is
 * passed through untouched.
 */
const categoryFormatter = computed(() =>
  withCategoryIndex(layout.value === "vertical" ? rawYFormatter.value : rawXFormatter.value),
);
const valueFormatter = computed(() =>
  layout.value === "vertical" ? rawXFormatter.value : rawYFormatter.value,
);

const xAxisDomain = computed(() => toAxisDomain(props.xDomain));
const yAxisDomain = computed(() => toAxisDomain(props.yDomain));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));

/** Explicit ticks / min-max-only / tick text styling, resolved per axis. */
const xAxis = computed(() =>
  resolveAxisProps(props.xExplicitTicks, props.xAxisConfig, props.minMaxTicksOnly),
);
const yAxis = computed(() =>
  resolveAxisProps(props.yExplicitTicks, props.yAxisConfig, props.minMaxTicksOnly),
);

/** `AxisConfig.tickLine` overrides the top-level `x/yTickLine` when set. */
const showXTickLine = computed(() => props.xAxisConfig?.tickLine ?? props.xTickLine ?? false);
const showYTickLine = computed(() => props.yAxisConfig?.tickLine ?? props.yTickLine ?? false);

const mergedContainerProps = computed(() => ({
  data: props.data,
  layout: layout.value,
  syncId: props.syncId,
  ...props.containerProps,
}));

const referenceLines = computed(() => props.referenceLines ?? []);

/** Short category axes skip vccs preserveEnd thinning (DOM text measurement). */
const SMALL_CATEGORY_AXIS_MAX = 12;

function resolveCategoryAxisInterval(
  configured: VccsAxisInterval | undefined,
  isCategoryAxis: boolean,
): VccsAxisInterval | undefined {
  if (configured !== undefined) return configured;
  if (isCategoryAxis && props.data.length <= SMALL_CATEGORY_AXIS_MAX) return 0;
  return undefined;
}

const xAxisInterval = computed(() =>
  resolveCategoryAxisInterval(
    layout.value === "vertical" ? yAxis.value.interval : xAxis.value.interval,
    layout.value !== "vertical" && props.xAxisKey !== undefined,
  ),
);

const yAxisInterval = computed(() =>
  resolveCategoryAxisInterval(
    layout.value === "vertical" ? xAxis.value.interval : yAxis.value.interval,
    layout.value === "vertical" && props.xAxisKey !== undefined,
  ),
);
</script>

<template>
  <ResponsiveContainer width="100%" :height="height">
    <component :is="container" v-bind="mergedContainerProps">
      <CartesianGrid
        v-if="showXGrid || showYGrid"
        :horizontal="showYGrid"
        :vertical="showXGrid"
        stroke-dasharray="3 3"
      />
      <!--
        Horizontal orientation: vccs uses layout="vertical" which swaps the axes.
        The category (dataKey) axis becomes YAxis; the value axis becomes XAxis.
      -->
      <XAxis
        v-if="!hideXAxis"
        :data-key="layout === 'vertical' ? undefined : xAxisKey"
        :hide="hideXAxis"
        :tick-line="showXTickLine"
        :axis-line="xDomainLine ?? true"
        :tick-count="layout === 'vertical' ? yNumTicks : xNumTicks"
        :tick-formatter="layout === 'vertical' ? valueFormatter : categoryFormatter"
        :domain="layout === 'vertical' ? yAxisDomain : xAxisDomain"
        :ticks="layout === 'vertical' ? yAxis.ticks : xAxis.ticks"
        :interval="layout === 'vertical' ? yAxisInterval : xAxisInterval"
        :tick="layout === 'vertical' ? (yAxis.tick ?? true) : (xAxis.tick ?? true)"
        :label="layout === 'vertical' ? yLabel : xLabel"
        :type="layout === 'vertical' ? 'number' : 'category'"
      />
      <YAxis
        v-if="!hideYAxis"
        :data-key="layout === 'vertical' ? xAxisKey : undefined"
        :hide="hideYAxis"
        :tick-line="showYTickLine"
        :axis-line="yDomainLine ?? true"
        :tick-count="layout === 'vertical' ? xNumTicks : yNumTicks"
        :tick-formatter="layout === 'vertical' ? categoryFormatter : valueFormatter"
        :domain="layout === 'vertical' ? xAxisDomain : yAxisDomain"
        :ticks="layout === 'vertical' ? xAxis.ticks : yAxis.ticks"
        :interval="layout === 'vertical' ? xAxisInterval : yAxisInterval"
        :tick="layout === 'vertical' ? (xAxis.tick ?? true) : (yAxis.tick ?? true)"
        :label="layout === 'vertical' ? xLabel : yLabel"
        :type="layout === 'vertical' ? 'category' : 'number'"
      />

      <slot />

      <ReferenceLine
        v-for="(line, i) in referenceLines"
        :key="i"
        :x="line.x"
        :y="line.y"
        :stroke="line.color ?? '#888'"
        :stroke-width="line.strokeWidth ?? 1"
        :stroke-dasharray="line.strokeDasharray"
        :label="line.label"
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
    </component>
  </ResponsiveContainer>
</template>
