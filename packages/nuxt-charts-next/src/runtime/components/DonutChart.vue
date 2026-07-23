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
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "vccs";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import HalftoneRadialDefs, { halftoneRadialId } from "./internal/HalftoneRadialDefs";
import type { DonutChartProps } from "../types/charts";
import { DonutType } from "../enums";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { themeToVars } from "../utils/theme";

const props = defineProps<DonutChartProps<T>>();

/** Per-chart `--vc-*` overrides for the legend / tooltip tokens. */
const themeVars = computed(() => themeToVars(props.theme));

const halftoneScope = useId();

/**
 * Measured width of the chart box.
 *
 * The radial halftone places its annuli in chart coordinates, so it needs the
 * pixel centre — and vccs resolves `cx: "50%"` internally without exposing it.
 * Observing our own wrapper is the cheapest way to learn the same number.
 */
const root = ref<HTMLElement>();
const chartWidth = ref(0);
let observer: ResizeObserver | undefined;

onMounted(() => {
  if (!root.value || typeof ResizeObserver === "undefined") return;
  observer = new ResizeObserver((entries) => {
    chartWidth.value = entries[0]?.contentRect.width ?? 0;
  });
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = undefined;
});

/**
 * Radial 1-bit dither on the ring. Needs exact pixel geometry to place its
 * annuli, which is only available on the auto-fit-with-height path below — so
 * it silently falls back to flat fills when the chart is sized by percentage.
 */
const useHalftone = computed(
  () =>
    props.dither === "halftone"
    && !!props.height
    && props.height > 0
    && chartWidth.value > 0,
);

/** Zip the value array against the categories record (positional, matching v2). */
const segments = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((value, i) => ({
    name: cats[i]?.name ?? String(i),
    value,
    // vccs reads `fill` directly from the data entry to color each sector
    fill: useHalftone.value
      ? `url(#${halftoneRadialId(halftoneScope, i)})`
      : (cats[i]?.color ?? `var(--chart-color-${i})`),
  }));
});

/** Flat colours in data order, for the halftone lattice to paint with. */
const segmentColors = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((_, i) => cats[i]?.color ?? `var(--chart-color-${i})`);
});

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

/**
 * Ring geometry in px for the halftone annuli.
 *
 * The `<defs>` are emitted inside the same SVG as the sectors, so the pattern
 * lives in chart coordinates. vccs centres the pie at 50%/50% of its box; a
 * half donut instead sits on the bottom edge, matching the `angles` above.
 *
 * `cx` is unknown until the container measures itself, so it is expressed as a
 * fraction of the chart width via the pattern's own box — see the width/height
 * passed to `HalftoneRadialDefs`.
 */
const halftoneRing = computed(() => {
  const outer = typeof outerRadius.value === "number" ? outerRadius.value : 0;
  const inner = typeof innerRadius.value === "number" ? innerRadius.value : 0;
  const height = props.height ?? 0;
  return {
    inner,
    outer,
    cx: chartWidth.value / 2,
    cy: props.type === DonutType.Half ? height : height / 2,
  };
});

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);
</script>

<template>
  <div ref="root" class="donut-chart vue-chrts" :style="{ position: 'relative', width: '100%', height: `${height ?? (radius ? radius * 2 : 200)}px`, ...themeVars }">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <!--
          Radial dither paints. Built with `h()` so they land in the SVG
          namespace; see HalftoneRadialDefs.
        -->
        <HalftoneRadialDefs
          v-if="useHalftone"
          :scope="halftoneScope"
          :colors="segmentColors"
          :cx="halftoneRing.cx"
          :cy="halftoneRing.cy"
          :inner-radius="halftoneRing.inner"
          :outer-radius="halftoneRing.outer"
          :cell="ditherCell ?? 2"
          :from="ditherFrom ?? 0"
          :to="ditherTo ?? 1"
          :bias="ditherBias ?? 1"
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
      </PieChart>
    </ResponsiveContainer>

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
