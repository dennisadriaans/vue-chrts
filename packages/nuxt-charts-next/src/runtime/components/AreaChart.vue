<script setup lang="ts" generic="T">
/**
 * Area chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `AreaChartProps` config API and composes the
 * `vccs` `<AreaChart>` + one `<Area>` per category.
 */
import { computed } from "vue";
import { Area, AreaChart as VccsAreaChart } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import type { AreaChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { curveTypeToVccs } from "../utils/curve";
import { markerToDot, normalizeMarkerConfig, toStrokeDasharray } from "../utils/marker";
import { DEFAULT_GRADIENT_STOPS, gradientId } from "../utils/gradient";

const props = defineProps<AreaChartProps<T>>();

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

/** When `gradientStops` is set, fill each area with its own vertical gradient. */
const useGradient = computed(() => Array.isArray(props.gradientStops));
const gradientStops = computed(() =>
  props.gradientStops?.length ? props.gradientStops : DEFAULT_GRADIENT_STOPS,
);
</script>

<template>
  <CartesianFrame :container="VccsAreaChart" v-bind="props">
    <defs v-if="useGradient">
      <linearGradient
        v-for="s in series"
        :id="gradientId(s.dataKey)"
        :key="s.dataKey"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          v-for="(gs, i) in gradientStops"
          :key="i"
          :offset="gs.offset"
          :stop-color="s.color"
          :stop-opacity="gs.stopOpacity"
        />
      </linearGradient>
    </defs>
    <Area
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :type="curve"
      :stack-id="stackId"
      :stroke="s.color"
      :fill="useGradient ? `url(#${gradientId(s.dataKey)})` : s.color"
      :fill-opacity="useGradient ? 1 : fillOpacity"
      :stroke-width="lineWidth ?? 2"
      :stroke-dasharray="dashArray"
      :dot="(s.dot as boolean)"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
    />
  </CartesianFrame>
</template>
