<script setup lang="ts" generic="T">
/**
 * Line chart adapter.
 *
 * Accepts the `nuxt-charts` v2 `LineChartProps` config API and composes the
 * `vccs` `<LineChart>` + one `<Line>` per category.
 */
import { computed } from "vue";
import { Line, LineChart as VccsLineChart } from "vccs";
import CartesianFrame from "./internal/CartesianFrame.vue";
import type { LineChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { curveTypeToVccs } from "../utils/curve";
import { markerToDot, normalizeMarkerConfig, toStrokeDasharray } from "../utils/marker";

const props = defineProps<LineChartProps<T>>();

const markers = computed(() => normalizeMarkerConfig(props.markerConfig));

/** Series enriched with the resolved `vccs` dot config from `markerConfig`. */
const series = computed(() =>
  categoriesToSeries(props.categories).map((s) => ({
    ...s,
    dot: markerToDot(markers.value[s.dataKey], s.color),
  })),
);

const curve = computed(() => curveTypeToVccs(props.curveType));
const stackId = computed(() => (props.stacked ? "stack" : undefined));
const dashArray = computed(() => toStrokeDasharray(props.lineDashArray));

const xAxisKey = computed(() => (props.xAxis !== undefined ? String(props.xAxis) : undefined));
</script>

<template>
  <CartesianFrame :container="VccsLineChart" :x-axis-key="xAxisKey" v-bind="props">
    <Line
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :type="curve"
      :stack-id="stackId"
      :stroke="s.color"
      :stroke-width="lineWidth ?? 2"
      :stroke-dasharray="dashArray"
      :dot="(s.dot as boolean)"
      :hide="s.hidden"
      :is-animation-active="duration !== undefined && duration !== 0"
    />
  </CartesianFrame>
</template>
