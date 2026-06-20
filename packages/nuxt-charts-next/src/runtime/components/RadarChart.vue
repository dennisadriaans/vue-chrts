<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * Radar chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Composes the `vccs` `<RadarChart>` with a `<PolarGrid>`, a `<PolarAngleAxis>`
 * bound to `dataKey` (the spoke labels) and a `<PolarRadiusAxis>`, plus one
 * `<Radar>` polygon per series defined in `categories`.
 */
import { computed } from "vue";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as VccsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "vccs";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import type { RadarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps } from "../utils/legend";
import { toCssProperties } from "../utils/style";

const props = defineProps<RadarChartProps<T>>();

/** One radar polygon per visible series in `categories`. */
const series = computed(() => categoriesToSeries(props.categories).filter((s) => !s.hidden));

const angleKey = computed(() => String(props.dataKey));
const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));
</script>

<template>
  <ResponsiveContainer width="100%" :height="height">
    <VccsRadarChart :data="data">
      <PolarGrid />
      <PolarAngleAxis :data-key="angleKey" :tick-formatter="angleFormatter" />
      <PolarRadiusAxis v-if="!hideRadiusAxis" />

      <Radar
        v-for="s in series"
        :key="s.dataKey"
        :data-key="s.dataKey"
        :name="s.name"
        :stroke="s.color"
        :fill="s.color"
        :fill-opacity="fillOpacity ?? 0.6"
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
    </VccsRadarChart>
  </ResponsiveContainer>
</template>
