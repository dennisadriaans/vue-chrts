<script setup lang="ts" generic="T">
/**
 * Donut chart adapter (maps onto the `vccs` Pie chart).
 *
 * Accepts the `nuxt-charts` v2 `DonutChartProps` config API: a `number[]` of
 * segment values plus a `categories` record for labels / colours. Colours are
 * passed as `fill` on each data entry — vccs reads fill from data, not Cell
 * children (Pie does not use extractCellProps unlike Bar).
 * `DonutType.Half` renders a semicircle gauge.
 */
import { computed, useId } from "vue";
import { Legend, Pie, PieChart, Tooltip } from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartLegend from "./internal/ChartLegend.vue";
import SegmentVariantDefs, { segmentGradientId } from "./internal/SegmentVariantDefs";
import { tooltipContentFor } from "./internal/tooltipContent";
import { variantId } from "../utils/variants";
import type { DonutChartProps } from "../types/charts";
import { DonutType } from "../enums";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { themeToVars } from "../utils/theme";

const props = defineProps<DonutChartProps<T>>();

/** Per-chart `--vc-*` overrides for the legend / tooltip tokens. */
const themeVars = computed(() => themeToVars(props.theme));

/** Scopes this chart's `<defs>` ids so several charts on a page never collide. */
const variantScope = useId();

const useGradient = computed(() => props.variant === "gradient");

/**
 * Zip the value array against the categories record (positional, matching v2).
 *
 * `dataKey` is the index rather than the label: labels come from user data and
 * may repeat or contain characters an SVG id cannot carry, whereas the index is
 * always unique and safe to build a `url(#…)` from.
 */
const segments = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((value, i) => {
    const color = cats[i]?.color ?? `var(--chart-color-${i})`;
    return {
      name: cats[i]?.name ?? String(i),
      value,
      dataKey: String(i),
      color,
      // vccs reads `fill` directly from the data entry to color each sector
      fill: useGradient.value ? `url(#${segmentGradientId(String(i), variantScope)})` : color,
      filter: props.glow ? `url(#${variantId("glow", String(i), variantScope)})` : undefined,
    };
  });
});

/** Segments reduced to what the `<defs>` need: a stable id and a real colour. */
const paintedSegments = computed(() =>
  segments.value.map((s) => ({ dataKey: s.dataKey, color: s.color })),
);

const tooltipContent = computed(() =>
  tooltipContentFor(props.tooltipVariant, props.tooltipRoundness),
);

/** Default ring thickness (px) when `arcWidth` is not supplied. */
const DEFAULT_ARC_WIDTH = 40;
/** Fraction of the available radius the ring fills in auto-fit mode. */
const AUTO_OUTER_FRACTION = 0.9;

/**
 * Resolve outer/inner radius. When `radius` is omitted or `0` we auto-fit the
 * ring to the container (v2 parity, and what every gallery example expects):
 *  - with a known `height`, derive exact pixel radii so `arcWidth` is honoured
 *    as a true pixel thickness;
 *  - without a height, fall back to percentage radii so vccs sizes to its box.
 * A positive `radius` pins an explicit pixel outer radius (playground usage).
 */
const radii = computed(() => {
  const arcWidth = props.arcWidth ?? DEFAULT_ARC_WIDTH;

  // Explicit pixel outer radius.
  if (props.radius && props.radius > 0) {
    return {
      outerRadius: props.radius as number | string,
      innerRadius: Math.max(props.radius - arcWidth, 0) as number | string,
    };
  }

  // Auto-fit with a known height → exact pixel radii, so `arcWidth` is honoured
  // as a true pixel thickness. A full ring is bounded by half the height; a half
  // gauge (top semicircle) is bounded by the full height.
  if (props.height && props.height > 0) {
    const bound = props.type === DonutType.Half ? props.height : props.height / 2;
    const outerRadius = bound * AUTO_OUTER_FRACTION;
    return {
      outerRadius,
      innerRadius: Math.max(outerRadius - arcWidth, 0),
    };
  }

  // Auto-fit without a usable height → percentage radii so vccs sizes to its box.
  return { outerRadius: "90%", innerRadius: "60%" };
});

const outerRadius = computed(() => radii.value.outerRadius);
const innerRadius = computed(() => radii.value.innerRadius);

/** Half donut renders the top semicircle as a gauge. */
const angles = computed(() =>
  props.type === DonutType.Half
    ? { startAngle: 180, endAngle: 0 }
    : { startAngle: 0, endAngle: 360 },
);

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);
</script>

<template>
  <div class="donut-chart vue-chrts" :style="{ position: 'relative', width: '100%', height: `${height ?? (radius ? radius * 2 : 200)}px`, ...themeVars }">
    <ChartContainer width="100%" height="100%">
      <PieChart>
        <!--
          Built with `h()` so the paints land in the SVG namespace and each
          segment's `fill="url(#…)"` resolves.
        -->
        <SegmentVariantDefs
          v-if="useGradient || glow"
          :segments="paintedSegments"
          :scope="variantScope"
          :gradient="useGradient"
          :glow="glow === true"
        />
        <Pie
          :data="segments"
          data-key="value"
          name-key="name"
          :inner-radius="innerRadius"
          :outer-radius="outerRadius"
          :start-angle="angles.startAngle"
          :end-angle="angles.endAngle"
          :padding-angle="padAngle ?? 0"
          :stroke="stroke ?? 'none'"
          :is-animation-active="duration !== undefined && duration !== 0"
        />
        <Tooltip v-if="!hideTooltip" :content="tooltipContent" :is-animation-active="false" />
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
      </PieChart>
    </ChartContainer>

    <!-- Centered overlay for custom content (v2 parity: default slot). -->
    <div
      v-if="$slots.default"
      class="donut-chart__center"
      :style="{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }"
    >
      <slot />
    </div>
  </div>
</template>
