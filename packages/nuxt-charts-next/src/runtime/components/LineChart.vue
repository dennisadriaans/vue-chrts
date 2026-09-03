<script setup lang="ts" generic="T">
/**
 * Line chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `LineChartProps` config API and composes the
 * `vccs` `<LineChart>` + one `<Line>` per category.
 */
import { computed, useId } from "vue";
import { Line, LineChart as VccsLineChart } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import AreaVariantDefs from "./internal/AreaVariantDefs";
import ChartDot from "./internal/ChartDot";
import type { LineChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { curveTypeToVccs } from "../utils/curve";
import { markerToDot, normalizeMarkerConfig, toStrokeDasharray } from "../utils/marker";
import { strokeDasharrayFor, variantId } from "../utils/variants";

const props = defineProps<LineChartProps<T>>();

/** Scopes this chart's `<defs>` ids so several charts on a page never collide. */
const variantScope = useId();

const markers = computed(() => normalizeMarkerConfig(props.markerConfig));

/** Series enriched with the resolved `vccs` dot config from `markerConfig`. */
const series = computed(() =>
  categoriesToSeries(props.categories).map((s) => ({
    ...s,
    dot: markerToDot(markers.value[s.dataKey], s.color),
  })),
);

/** Series narrowed to the shape the glow `<defs>` need. */
const paintedSeries = computed(() =>
  series.value.map((s) => ({ dataKey: s.dataKey, color: s.color })),
);

const curve = computed(() => curveTypeToVccs(props.curveType));
const stackId = computed(() => (props.stacked ? "stack" : undefined));

/**
 * The line's dash pattern. An explicit `lineDashArray` wins, so a caller
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

/** `url(#…)` of the outer-glow filter, or `undefined` when the series does not glow. */
function glowFor(dataKey: string): string | undefined {
  return props.glow ? `url(#${variantId("glow", dataKey, variantScope)})` : undefined;
}

const xAxisKey = computed(() => (props.xAxis !== undefined ? String(props.xAxis) : undefined));
</script>

<template>
  <CartesianFrame
    :container="VccsLineChart"
    :x-axis-key="xAxisKey"
    :frame-class="frameClass"
    v-bind="props"
  >
    <!--
      Built with `h()` so the filter lands in the SVG namespace and the
      `filter="url(#…)"` reference on each line resolves.
    -->
    <AreaVariantDefs v-if="glow" :series="paintedSeries" :scope="variantScope" glow />
    <Line
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :y-axis-id="s.yAxisId"
      :type="curve"
      :stack-id="stackId"
      :stroke="s.color"
      :stroke-width="lineWidth ?? 2"
      :stroke-dasharray="dashArray"
      :filter="glowFor(s.dataKey)"
      :dot="showDots || (s.dot as boolean)"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
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
    </Line>
  </CartesianFrame>
</template>
