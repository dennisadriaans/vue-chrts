<script setup lang="ts" generic="T">
/**
 * Area chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `AreaChartProps` config API and composes the
 * `vccs` `<AreaChart>` + one `<Area>` per category.
 *
 * Three fill treatments can be selected, in this order of precedence:
 * `dither` (a halftone tile), `variant` (a textured pattern), then the v2
 * `gradient` fade. Each is opt-in, so a chart that sets none of them renders
 * exactly as it did before any of this existed.
 */
import { computed, useId } from "vue";
import { Area, AreaChart as VccsAreaChart } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import GradientDefs from "./internal/GradientDefs";
import StrokeGradientDefs from "./internal/StrokeGradientDefs";
import type { AreaChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { curveTypeToVccs } from "../utils/curve";
import { markerToDot, normalizeMarkerConfig, toStrokeDasharray } from "../utils/marker";
import { DEFAULT_GRADIENT_STOPS, gradientId, strokeGradientId } from "../utils/gradient";
import DitherDefs from "./internal/DitherDefs";
import AreaVariantDefs, { areaFillId } from "./internal/AreaVariantDefs";
import ChartDot from "./internal/ChartDot";
import { ditherId, type DitherVariant } from "../utils/dither";
import { strokeDasharrayFor, variantId } from "../utils/variants";

// `gradient` is a Boolean prop, so Vue coerces an absent value to `false`. Default
// it to `true` explicitly so the area keeps its fade-out fill unless opted out.
const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  gradient: true,
  accessibleDataTable: true,
});

const gradientScope = useId();
const markers = computed(() => normalizeMarkerConfig(props.markerConfig));

/** Series enriched with the resolved `vccs` dot config from `markerConfig`. */
const series = computed(() =>
  categoriesToSeries(props.categories).map((s) => ({
    ...s,
    dot: markerToDot(markers.value[s.dataKey], s.color),
  })),
);

const curve = computed(() => curveTypeToVccs(props.curveType));
/** A shared stackId stacks the areas; per-series ids overlay them. */
const stackId = computed(() => (props.stacked ? "stack" : undefined));

/**
 * Normalising each x position to 100% only means something once the series are
 * summed into a stack, so `percent` yields to `stacked`.
 */
const chartContainerProps = computed(() =>
  props.stacked && props.percent ? { stackOffset: "expand" } : {},
);
const fillOpacity = computed(() => (props.hideArea ? 0 : 0.6));

/**
 * Dithered (halftone) fill. Opt-in; uses a tiling pattern instead of a solid
 * or gradient paint. `true` selects the `bayer` variant.
 */
const useDither = computed(
  () => !props.hideArea && props.dither !== undefined && props.dither !== false,
);
const ditherVariant = computed<DitherVariant>(() =>
  typeof props.dither === "string" ? props.dither : "bayer",
);

/**
 * Textured fill from `variant`. Yields to `dither`, which is already a texture
 * of its own — layering the two would just muddy both.
 */
const useFillVariant = computed(
  () => !props.hideArea && props.variant !== undefined && !useDither.value,
);

/**
 * Vertical fade-out as the fill paint (no dither, no variant). On by default;
 * set `gradient: false` for a flat fill, or pass `gradientStops` to customise.
 */
const useGradientFill = computed(
  () => !props.hideArea && props.gradient !== false && !useDither.value && !useFillVariant.value,
);

/**
 * Same vertical fade composed on top of a dither pattern. Default on so Bayer
 * / noise / fade still dissolve toward the baseline; `gradient: false` keeps
 * a flat full-opacity dither.
 */
const useDitherFade = computed(
  () => useDither.value && props.gradient !== false,
);

const gradientStops = computed(() =>
  props.gradientStops?.length ? props.gradientStops : DEFAULT_GRADIENT_STOPS,
);

/**
 * Stops for the colour wash drawn under the dither dots. Without it the dots —
 * which cover only a few percent of a tile — read as bare texture instead of
 * the tinted, fading fill an area chart normally has.
 *
 * `ditherWash` scales the stop opacities, so `0` gives dots on their own.
 */
const ditherWashStops = computed(() => {
  if (!useDitherFade.value) return undefined;
  const scale = props.ditherWash ?? 1;
  if (scale <= 0) return undefined;
  return gradientStops.value.map((stop) => ({
    ...stop,
    stopOpacity: stop.stopOpacity * scale,
  }));
});

/** Series narrowed to those with a resolved colour, which the `<defs>` need. */
const paintedSeries = computed(() =>
  series.value.map((s) => ({ dataKey: s.dataKey, color: s.color })),
);

/** Resolve the `fill` for one series: dither pattern, variant, gradient, or flat colour. */
function fillFor(dataKey: string, color: string): string {
  if (useDither.value) return `url(#${ditherId(dataKey, gradientScope)})`;
  if (useFillVariant.value) return `url(#${areaFillId(props.variant!, dataKey, gradientScope)})`;
  if (useGradientFill.value) return `url(#${gradientId(dataKey, gradientScope)})`;
  return color;
}

function strokeFor(dataKey: string, color: string): string {
  return props.strokeGradient?.length
    ? `url(#${strokeGradientId(dataKey, gradientScope)})`
    : color;
}

/** `url(#…)` of the outer-glow filter, or `undefined` when the series does not glow. */
function glowFor(dataKey: string): string | undefined {
  return props.glow ? `url(#${variantId("glow", dataKey, gradientScope)})` : undefined;
}

/**
 * The outline's dash pattern. An explicit `lineDashArray` wins, so a caller
 * already passing a custom pattern is not overridden by the variant default.
 */
const dashArray = computed(
  () => toStrokeDasharray(props.lineDashArray) ?? strokeDasharrayFor(props.strokeVariant),
);

/**
 * Marching dashes are a CSS animation on the curve path rather than an SVG
 * `<animate>` child: `vccs` renders the curve itself and exposes no slot to put
 * child nodes inside that `<path>`.
 */
const frameClass = computed(() =>
  props.strokeVariant === "animated-dashed" ? "vc-dash-animated" : undefined,
);

/** Truthy `dot` is what makes `vccs` call the `#dot` slot at all. */
const showDots = computed(() => props.dotVariant !== undefined);

const xAxisKey = computed(() => (props.xAxis !== undefined ? String(props.xAxis) : undefined));

defineSlots<{
  tooltip?: (props: { values: T | undefined }) => unknown;
}>();
</script>

<template>
  <CartesianFrame
    :container="VccsAreaChart"
    :x-axis-key="xAxisKey"
    :container-props="chartContainerProps"
    :percent-axis="stacked === true && percent === true"
    :frame-class="frameClass"
    skeleton-shape="wave"
    v-bind="props"
  >
    <template v-if="$slots.tooltip" #tooltip="scope">
      <slot name="tooltip" v-bind="scope" />
    </template>
    <!--
      GradientDefs builds SVG nodes with `h()` so they land in the SVG namespace
      inside the chart surface. Do not wrap this in vccs `<Customized>`: that
      component subscribes to the chart store and re-renders on every tooltip
      mousemove, which recreates all gradients and freezes the page.
    -->
    <GradientDefs
      v-if="useGradientFill"
      :series="series"
      :stops="gradientStops"
      :scope="gradientScope"
    />
    <StrokeGradientDefs
      v-if="strokeGradient?.length"
      :series="paintedSeries"
      :stops="strokeGradient"
      :scope="gradientScope"
    />
    <!-- Same namespace/`Customized` constraints as GradientDefs above. -->
    <DitherDefs
      v-if="useDither"
      :series="series"
      :variant="ditherVariant"
      :scope="gradientScope"
      :tile="ditherTile ?? 8"
      :fade-stops="ditherWashStops"
      :height="height"
    />
    <AreaVariantDefs
      v-if="useFillVariant || glow"
      :series="paintedSeries"
      :variant="useFillVariant ? variant : undefined"
      :scope="gradientScope"
      :glow="glow === true"
    />
    <Area
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :y-axis-id="s.yAxisId"
      :type="curve"
      :stack-id="stackId"
      :stroke="strokeFor(s.dataKey, s.color)"
      :fill="fillFor(s.dataKey, s.color)"
      :fill-opacity="useGradientFill || useDither || useFillVariant ? 1 : fillOpacity"
      :stroke-width="lineWidth ?? 2"
      :stroke-dasharray="dashArray"
      :filter="glowFor(s.dataKey)"
      :dot="showDots || (s.dot as boolean)"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
      :transition="{ duration: (duration ?? 800) / 1000, ease: 'easeOut' }"
    >
      <template v-if="showDots" #dot="dotProps">
        <ChartDot
          :cx="dotProps.cx"
          :cy="dotProps.cy"
          :color="s.color"
          :variant="dotVariant"
          :size="dotSize ?? 3"
        />
      </template>
    </Area>
  </CartesianFrame>
</template>
