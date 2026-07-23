<script setup lang="ts" generic="T">
/**
 * Area chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `AreaChartProps` config API and composes the
 * `vccs` `<AreaChart>` + one `<Area>` per category.
 */
import { computed, useId } from "vue";
import { Area, AreaChart as VccsAreaChart } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import GradientDefs from "./internal/GradientDefs";
import type { AreaChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { curveTypeToVccs } from "../utils/curve";
import { markerToDot, normalizeMarkerConfig, toStrokeDasharray } from "../utils/marker";
import { DEFAULT_GRADIENT_STOPS, gradientId } from "../utils/gradient";
import DitherDefs from "./internal/DitherDefs";
import { ditherId, type DitherVariant } from "../utils/dither";

// `gradient` is a Boolean prop, so Vue coerces an absent value to `false`. Default
// it to `true` explicitly so the area keeps its fade-out fill unless opted out.
const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  gradient: true,
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
const fillOpacity = computed(() => (props.hideArea ? 0 : 0.6));
const dashArray = computed(() => toStrokeDasharray(props.lineDashArray));

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
 * Vertical fade-out as the fill paint (no dither). On by default; set
 * `gradient: false` for a flat fill, or pass `gradientStops` to customise.
 */
const useGradientFill = computed(
  () => !props.hideArea && props.gradient !== false && !useDither.value,
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

/** Resolve the `fill` for one series: dither pattern, gradient, or flat colour. */
function fillFor(dataKey: string, color: string): string {
  if (useDither.value) return `url(#${ditherId(dataKey, gradientScope)})`;
  if (useGradientFill.value) return `url(#${gradientId(dataKey, gradientScope)})`;
  return color;
}

const xAxisKey = computed(() => (props.xAxis !== undefined ? String(props.xAxis) : undefined));
</script>

<template>
  <CartesianFrame :container="VccsAreaChart" :x-axis-key="xAxisKey" v-bind="props">
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
    <Area
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :type="curve"
      :stack-id="stackId"
      :stroke="s.color"
      :fill="fillFor(s.dataKey, s.color)"
      :fill-opacity="useGradientFill || useDither ? 1 : fillOpacity"
      :stroke-width="lineWidth ?? 2"
      :stroke-dasharray="dashArray"
      :dot="(s.dot as boolean)"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
    />
  </CartesianFrame>
</template>
