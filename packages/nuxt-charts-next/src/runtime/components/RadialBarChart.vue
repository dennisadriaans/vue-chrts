<script setup lang="ts" generic="T">
/**
 * Radial bar chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Like {@link DonutChart}, takes a positional `number[]` aligned with
 * `categories`. Each value becomes one concentric bar in the `vccs`
 * `<RadialBarChart>`; colours come from `categories`.
 */
import { computed } from "vue";
import {
  Legend,
  RadialBar,
  RadialBarChart as VccsRadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "vccs";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import type { RadialBarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps } from "../utils/legend";
import { toCssProperties } from "../utils/style";

const props = defineProps<RadialBarChartProps<T>>();

/** Zip the value array against the categories record (positional, matching Donut). */
const bars = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((value, i) => ({
    name: cats[i]?.name ?? String(i),
    value,
    fill: cats[i]?.color ?? `var(--chart-color-${i})`,
  }));
});

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));
</script>

<template>
  <ResponsiveContainer width="100%" :height="height">
    <VccsRadialBarChart
      :data="bars"
      :inner-radius="innerRadius ?? '30%'"
      :outer-radius="outerRadius ?? '100%'"
      :start-angle="startAngle ?? 90"
      :end-angle="endAngle ?? -270"
    >
      <RadialBar
        data-key="value"
        :background="background ?? true"
        :corner-radius="cornerRadius"
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
    </VccsRadialBarChart>
  </ResponsiveContainer>
</template>
