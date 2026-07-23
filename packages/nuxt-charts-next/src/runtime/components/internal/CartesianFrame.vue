<script setup lang="ts" generic="T">
/**
 * Shared scaffolding for the cartesian charts (area, bar, line, bubble).
 *
 * Renders the responsive container, the supplied `vccs` chart container, the
 * grid, axes, tooltip and legend from the v2 config props — leaving the series
 * (`<Area>` / `<Bar>` / `<Line>` / `<Scatter>`) to the default slot. This keeps
 * every chart adapter small and the axis/legend/tooltip wiring in one place.
 */
import { computed, h, type Component } from "vue";
import type { TooltipContentProps } from "vccs";
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
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../../utils/legend";
import {
  AXIS_TICK_MARGIN,
  resolveAxisProps,
  resolveYAxes,
  resolveXAxisHeight,
  resolveYAxisWidth,
  toAxisLabel,
  toTickFormatter,
  toTickProp,
  type VccsAxisInterval,
} from "../../utils/axis";
import { categoriesToSeries } from "../../utils/categories";
import { toAxisDomain, toCssProperties } from "../../utils/style";
import { axisTickVars, resolveHoverRadius, resolveHoverVisible, themeToVars } from "../../utils/theme";
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
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);

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

/** Axis titles with explicit placement so they do not sit on top of tick values. */
const xAxisTitle = computed(() =>
  toAxisLabel(layout.value === "vertical" ? props.yLabel : props.xLabel, "insideBottom"),
);
const yAxisTitle = computed(() =>
  toAxisLabel(layout.value === "vertical" ? props.xLabel : props.yLabel, "insideLeft", {
    angle: -90,
  }),
);

const isCategoryYAxis = computed(
  () => layout.value === "vertical" && props.xAxisKey !== undefined,
);

const xAxisHeight = computed(() => resolveXAxisHeight({ hasTitle: !!xAxisTitle.value }));
const yAxisWidth = computed(() =>
  resolveYAxisWidth({ hasTitle: !!yAxisTitle.value, isCategoryAxis: isCategoryYAxis.value }),
);

/** Per-chart theme + per-axis tick colour/size overrides as inline `--vc-*` vars on the root. */
const rootStyle = computed(() => ({
  ...themeToVars(props.theme),
  ...axisTickVars("x", xAxis.value.tick),
  ...axisTickVars("y", yAxis.value.tick),
}));

/** Native `vccs` `tick` prop per axis — `true` by default, `{ textAnchor }` when aligned. */
const xTickProp = computed(() => toTickProp(xAxis.value.tick));
const yTickProp = computed(() => toTickProp(yAxis.value.tick));

/**
 * Grid / axis-line / tick-line SVG presentation, driven by the `--vc-*` tokens.
 * These read CSS variables so global theming, dark mode and the `theme` prop all
 * flow through without touching component code.
 */
const gridStroke = "var(--vc-grid-color)";
const axisLineStyle = { stroke: "var(--vc-axis-line-color)" } as const;
const tickLineStyle = { stroke: "var(--vc-axis-line-color)" } as const;

/** Hover cursor: token-driven fill/stroke; radius must be numeric for vccs Rectangle. */
const cursor = computed(() =>
  resolveHoverVisible(props.theme)
    ? {
        fill: "var(--vc-hover-fill)",
        stroke: "var(--vc-hover-stroke)",
        radius: resolveHoverRadius(props.theme),
      }
    : false,
);

/**
 * Axis-line (domain line) presentation. Shown → token-coloured SVG attrs;
 * hidden → `false`. `xDomainLine` / `yDomainLine` default to shown (v2 parity).
 */
const xAxisLine = computed(() => ((props.xDomainLine ?? true) ? axisLineStyle : false));
const yAxisLine = computed(() => ((props.yDomainLine ?? true) ? axisLineStyle : false));

/** Tick-line presentation, mirroring the axis-line logic. */
const xTickLineProp = computed(() => (showXTickLine.value ? tickLineStyle : false));
const yTickLineProp = computed(() => (showYTickLine.value ? tickLineStyle : false));

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

/**
 * `vccs` passes the raw category tick value as the tooltip label; axis ticks
 * go through `categoryFormatter` separately. Mirror that formatter here so
 * index-based `xFormatter` callbacks (v2 parity) affect the tooltip title too.
 */
const tooltipContent = computed(() => {
  const formatLabel = categoryFormatter.value;
  const titleFormatter = props.tooltipTitleFormatter;

  return (tooltipProps: TooltipContentProps) => {
    let label = tooltipProps.label;
    const row = tooltipProps.payload?.[0]?.payload as T | undefined;

    if (titleFormatter && row != null) {
      label = titleFormatter(row);
    } else if (formatLabel != null && label !== undefined && label !== "") {
      const rowIndex = row != null ? props.data.indexOf(row) : -1;
      const index =
        rowIndex >= 0
          ? rowIndex
          : typeof label === "number"
            ? label
            : Number(label);
      label = formatLabel(label, Number.isNaN(index) ? 0 : index);
    }

    return h(ChartTooltip, { ...tooltipProps, label });
  };
});

/**
 * The value y-axes. Empty for horizontal bars (which render the swapped
 * category axis instead) and when the y-axis is hidden outright.
 */
const resolvedYAxes = computed(() => {
  if (props.hideYAxis || layout.value === "vertical") return [];
  return resolveYAxes({
    series: categoriesToSeries(props.categories),
    yAxes: props.yAxes,
    minMaxTicksOnly: props.minMaxTicksOnly,
    primary: {
      ...yAxis.value,
      label: props.yLabel,
      domain: yAxisDomain.value,
      tickCount: props.yNumTicks,
      tickFormatter: valueFormatter.value,
      tickLine: showYTickLine.value,
      hide: false,
    },
  });
});
</script>

<template>
  <div class="vue-chrts" :style="rootStyle">
  <ResponsiveContainer width="100%" :height="height">
    <component :is="container" v-bind="mergedContainerProps">
      <CartesianGrid
        v-if="showXGrid || showYGrid"
        :horizontal="showYGrid"
        :vertical="showXGrid"
        :stroke="gridStroke"
        stroke-dasharray="var(--vc-grid-dash)"
        :stroke-width="'var(--vc-grid-width)'"
      />
      <!--
        Horizontal orientation: vccs uses layout="vertical" which swaps the axes.
        The category (dataKey) axis becomes YAxis; the value axis becomes XAxis.
      -->
      <XAxis
        v-if="!hideXAxis"
        :data-key="layout === 'vertical' ? undefined : xAxisKey"
        :hide="hideXAxis"
        :height="xAxisHeight"
        :tick="xTickProp"
        :tick-margin="AXIS_TICK_MARGIN.x"
        :tick-line="xTickLineProp"
        :axis-line="xAxisLine"
        :tick-count="layout === 'vertical' ? yNumTicks : xNumTicks"
        :tick-formatter="layout === 'vertical' ? valueFormatter : categoryFormatter"
        :domain="layout === 'vertical' ? yAxisDomain : xAxisDomain"
        :ticks="layout === 'vertical' ? yAxis.ticks : xAxis.ticks"
        :interval="layout === 'vertical' ? yAxisInterval : xAxisInterval"
        :label="xAxisTitle"
        :type="layout === 'vertical' ? 'number' : 'category'"
      />
      <!--
        Horizontal orientation keeps the single swapped category y-axis; only
        the standard layout supports several value axes (one per `yAxes` id).
      -->
      <!-- Horizontal orientation (layout="vertical"): the single swapped category y-axis. -->
      <YAxis
        v-if="!hideYAxis && layout === 'vertical'"
        :data-key="xAxisKey"
        :width="yAxisWidth"
        :tick="yTickProp"
        :tick-margin="AXIS_TICK_MARGIN.y"
        :tick-line="yTickLineProp"
        :axis-line="yAxisLine"
        :tick-count="xNumTicks"
        :tick-formatter="categoryFormatter"
        :domain="xAxisDomain"
        :ticks="xAxis.ticks"
        :interval="xAxisInterval"
        :label="yAxisTitle"
        type="category"
      />
      <!-- Standard layout: one value axis per resolved `yAxes` id (shared cutover styling). -->
      <YAxis
        v-for="axis in resolvedYAxes"
        :key="axis.id"
        :y-axis-id="axis.id"
        :orientation="axis.orientation"
        :hide="axis.hide"
        :width="yAxisWidth"
        :tick="toTickProp(axis.tick)"
        :tick-margin="AXIS_TICK_MARGIN.y"
        :tick-line="axis.tickLine ? yTickLineProp : false"
        :axis-line="yAxisLine"
        :tick-count="axis.tickCount"
        :tick-formatter="axis.tickFormatter"
        :domain="axis.domain"
        :ticks="axis.ticks"
        :interval="axis.interval"
        :label="toAxisLabel(axis.label, axis.orientation === 'right' ? 'insideRight' : 'insideLeft', { angle: axis.orientation === 'right' ? 90 : -90 })"
        type="number"
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

      <Tooltip
        v-if="!hideTooltip"
        :content="tooltipContent"
        :cursor="cursor"
        :is-animation-active="false"
      />
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
  </div>
</template>
