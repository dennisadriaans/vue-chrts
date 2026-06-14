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

const props = defineProps<LineChartProps<T>>();

const series = computed(() => categoriesToSeries(props.categories));
const curve = computed(() => curveTypeToVccs(props.curveType));
const stackId = computed(() => (props.stacked ? "stack" : undefined));
</script>

<template>
  <CartesianFrame :container="VccsLineChart" v-bind="props">
    <Line
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :type="curve"
      :stack-id="stackId"
      :stroke="s.color"
      :stroke-width="lineWidth ?? 2"
      :dot="false"
      :hide="s.hidden"
      :is-animation-active="duration !== 0"
    />
  </CartesianFrame>
</template>
