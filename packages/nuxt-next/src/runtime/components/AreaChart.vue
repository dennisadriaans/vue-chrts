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

const props = defineProps<AreaChartProps<T>>();

const series = computed(() => categoriesToSeries(props.categories));
const curve = computed(() => curveTypeToVccs(props.curveType));
/** A shared stackId stacks the areas; per-series ids overlay them. */
const stackId = computed(() => (props.stacked ? "stack" : undefined));
const fillOpacity = computed(() => (props.hideArea ? 0 : 0.6));
</script>

<template>
  <CartesianFrame :container="VccsAreaChart" v-bind="props">
    <Area
      v-for="s in series"
      :key="s.dataKey"
      :data-key="s.dataKey"
      :name="s.name"
      :type="curve"
      :stack-id="stackId"
      :stroke="s.color"
      :fill="s.color"
      :fill-opacity="fillOpacity"
      :stroke-width="lineWidth ?? 2"
      :hide="s.hidden"
      :is-animation-active="duration !== 0"
    />
  </CartesianFrame>
</template>
