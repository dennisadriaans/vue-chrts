<script setup lang="ts" generic="T">
/**
 * Funnel chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Like {@link DonutChart}, takes a positional `number[]` aligned with
 * `categories`. Each value becomes one trapezoid stage in the `vccs`
 * `<FunnelChart>`; colours come from `categories`. An optional `<LabelList>`
 * renders the value on each stage.
 */
import { computed } from "vue";
import {
  Funnel,
  FunnelChart as VccsFunnelChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "vccs";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import type { FunnelChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps } from "../utils/legend";
import { toCssProperties } from "../utils/style";

const props = defineProps<FunnelChartProps<T>>();

/** Zip the value array against the categories record (positional, matching Donut). */
const stages = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((value, i) => ({
    name: cats[i]?.name ?? String(i),
    value,
    fill: cats[i]?.color ?? `var(--chart-color-${i})`,
  }));
});

const showValueLabel = computed(() => props.showValueLabel ?? true);
const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));
</script>

<template>
  <ResponsiveContainer width="100%" :height="height">
    <VccsFunnelChart>
      <Funnel
        :data="stages"
        data-key="value"
        name-key="name"
        :last-shape-type="lastShapeType ?? 'triangle'"
        :is-animation-active="duration !== undefined && duration !== 0"
      >
        <LabelList v-if="showValueLabel" data-key="value" position="right" />
      </Funnel>
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
    </VccsFunnelChart>
  </ResponsiveContainer>
</template>
