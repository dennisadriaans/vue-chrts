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
import { CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "vccs";
import type { CartesianChartBaseProps } from "../../types/charts";
import type { Orientation } from "../../enums";
import { legendPositionToLegendProps } from "../../utils/legend";
import { toTickFormatter } from "../../utils/axis";
import { toAxisDomain, toCssProperties } from "../../utils/style";

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

const xTickFormatter = computed(() =>
  toTickFormatter(props.xFormatter ?? props.xAxisConfig?.tickFormat),
);
const yTickFormatter = computed(() =>
  toTickFormatter(props.yFormatter ?? props.yAxisConfig?.tickFormat),
);

/** vccs container layout: 'vertical' swaps the value/category axes for horizontal bars. */
const layout = computed<"horizontal" | "vertical">(() =>
  props.orientation === "horizontal" ? "vertical" : "horizontal",
);

const xAxisDomain = computed(() => toAxisDomain(props.xDomain));
const yAxisDomain = computed(() => toAxisDomain(props.yDomain));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));

const mergedContainerProps = computed(() => ({
  data: props.data,
  layout: layout.value,
  ...props.containerProps,
}));
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
      <XAxis
        v-if="!hideXAxis"
        :data-key="xAxisKey"
        :hide="hideXAxis"
        :tick-line="xTickLine ?? false"
        :axis-line="xDomainLine ?? true"
        :tick-count="xNumTicks"
        :tick-formatter="xTickFormatter"
        :domain="xAxisDomain"
        :label="xLabel"
      />
      <YAxis
        v-if="!hideYAxis"
        :hide="hideYAxis"
        :tick-line="yTickLine ?? false"
        :axis-line="yDomainLine ?? true"
        :tick-count="yNumTicks"
        :tick-formatter="yTickFormatter"
        :domain="yAxisDomain"
        :label="yLabel"
      />

      <slot />

      <Tooltip v-if="!hideTooltip" />
      <Legend
        v-if="!hideLegend"
        :align="legend.align"
        :vertical-align="legend.verticalAlign"
        :layout="legend.layout"
        :wrapper-style="legendWrapperStyle"
      />
    </component>
  </ResponsiveContainer>
</template>
