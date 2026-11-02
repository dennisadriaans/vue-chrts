<script setup lang="ts" generic="T">
/**
 * Radial bar chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Like {@link DonutChart}, takes a positional `number[]` aligned with
 * `categories`. Each value becomes one concentric bar in the `vccs`
 * `<RadialBarChart>`; colours come from `categories`.
 */
import { computed, ref } from "vue";
import {
  Legend,
  RadialBar,
  RadialBarChart as VccsRadialBarChart,
  Sector,
  Tooltip,
  type CursorSlotProps,
} from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartSkeleton from "./internal/ChartSkeleton.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import ChartEmptyState from "./internal/ChartEmptyState.vue";
import ChartAccessibility from "./internal/ChartAccessibility.vue";
import { tooltipContentFor } from "./internal/tooltipContent";
import PolarCenterSync from "./internal/PolarCenterSync";
import type { RadialBarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { resolveHoverVisible, themeToVars } from "../utils/theme";
import { DEFAULT_MAX_DATA_POINTS, normalizeNamedValues, sampleData, warnDataLimit } from "../utils/data";

const props = withDefaults(defineProps<RadialBarChartProps<T>>(), { accessibleDataTable: true });

const themeVars = computed(() => themeToVars(props.theme));

/** Zip the value array against the categories record (positional, matching Donut). */
const bars = computed(() => {
  const cats = categoriesToSeries(props.categories);
  const normalized = normalizeNamedValues(props.data, cats.map((cat) => String(cat.name)), props.nameKey, props.valueKey);
  const limit = props.maxDataPoints ?? DEFAULT_MAX_DATA_POINTS;
  warnDataLimit("RadialBarChart", normalized.length, limit);
  return sampleData(normalized, limit).map(({ row, value, sourceIndex, name }) => ({
    ...(row && typeof row === "object" ? row : {}),
    name,
    value,
    fill: cats[sourceIndex]?.color ?? `var(--vc-series-${sourceIndex % 8})`,
  }));
});

/**
 * Sweep of the track. `variant="semi"` is shorthand for the upper semicircle;
 * an explicit `startAngle` / `endAngle` still wins, so the shorthand can be set
 * on a chart that then fine-tunes one end.
 */
const angles = computed(() => {
  const semi = props.variant === "semi";
  return {
    startAngle: props.startAngle ?? (semi ? 180 : 90),
    endAngle: props.endAngle ?? (semi ? 0 : -270),
  };
});

const tooltipContent = computed(() =>
  tooltipContentFor(props.tooltipVariant, props.tooltipRoundness, props.tooltipTitleFormatter as ((data: unknown) => string | number) | undefined),
);
const accessibleRows = computed(() => bars.value.map((bar) => ({ label: bar.name, values: [{ label: "Value", value: bar.value }] })));

/** Keep the ring highlight active when only the floating tooltip is hidden. */
const hiddenTooltipContent = () => null;

const radiusInPixels = (radius: number | string, maxRadius: number) => {
  if (typeof radius === "number") return radius;
  const percentage = Number.parseFloat(radius);
  return maxRadius * percentage / 100;
};

/**
 * vccs gives the radial cursor identical radii. Fill the whole category band
 * instead, using the legend-aware plot area and a subtle shade of the bar.
 */
const radialCursorProps = (cursor: CursorSlotProps) => {
  const maxRadius = Math.min(cursor.width, cursor.height) / 2;
  const outer = radiusInPixels(props.outerRadius ?? "100%", maxRadius);
  const inner = radiusInPixels(props.innerRadius ?? "30%", maxRadius);
  const halfBand = (outer - inner) / Math.max(bars.value.length, 1) / 2;
  const color = bars.value[Number(cursor.payloadIndex)]?.fill ?? "var(--vc-series-0)";

  return {
    cx: cursor.cx,
    cy: cursor.cy,
    startAngle: cursor.startAngle,
    endAngle: cursor.endAngle,
    innerRadius: Math.max(cursor.innerRadius - halfBand, 0),
    outerRadius: cursor.outerRadius + halfBand,
    cornerRadius: props.cornerRadius,
    fill: props.theme?.hover?.fill ?? `color-mix(in oklab, ${color} 20%, transparent)`,
    stroke: "none",
    class: cursor.class,
    style: cursor.style,
  };
};

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);

/** Legend-aware centre, reported by `<PolarCenterSync>` once the offset settles. */
const center = ref<{ cx: number; cy: number }>();
const onCenter = (next: { cx: number; cy: number }) => {
  if (center.value?.cx === next.cx && center.value?.cy === next.cy) return;
  center.value = next;
};
</script>

<template>
  <div class="vue-chrts" role="group" :aria-label="ariaLabel ?? 'Radial bar chart'" :style="themeVars">
    <ChartAccessibility :label="ariaLabel ?? 'Radial bar chart'" :description="ariaDescription" :rows="accessibleRows" :show-table="accessibleDataTable !== false" />
    <ChartSkeleton
      v-if="loading"
      :height="height ?? 200"
      shape="ring"
      :label="loadingLabel ?? 'Loading'"
    />
    <ChartEmptyState v-else-if="error || bars.length === 0" :height="height" :message="error || emptyLabel" />
    <ChartContainer v-else width="100%" :height="height">
    <VccsRadialBarChart
      :data="bars"
      :inner-radius="innerRadius ?? '30%'"
      :outer-radius="outerRadius ?? '100%'"
      :start-angle="angles.startAngle"
      :end-angle="angles.endAngle"
      :cx="center?.cx"
      :cy="center?.cy"
    >
      <PolarCenterSync :on-center="onCenter" />
      <RadialBar
        data-key="value"
        :background="background ?? true"
        :corner-radius="cornerRadius"
        :is-animation-active="duration !== undefined && duration !== 0"
        :transition="{ duration: (duration ?? 400) / 1000, ease: 'easeOut' }"
      />
      <Tooltip
        :content="hideTooltip ? hiddenTooltipContent : tooltipContent"
        :cursor="resolveHoverVisible(theme)"
        :is-animation-active="false"
      >
        <template #cursor="slotProps">
          <Sector v-bind="radialCursorProps(slotProps)" />
        </template>
      </Tooltip>
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
    </VccsRadialBarChart>
  </ChartContainer>
  </div>
</template>
