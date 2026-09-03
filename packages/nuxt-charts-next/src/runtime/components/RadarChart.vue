<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * Radar chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Composes the `vccs` `<RadarChart>` with a `<PolarGrid>`, a `<PolarAngleAxis>`
 * bound to `dataKey` (the spoke labels) and a `<PolarRadiusAxis>`, plus one
 * `<Radar>` polygon per series defined in `categories`.
 */
import { computed, ref } from "vue";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as VccsRadarChart,
  Tooltip,
} from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import PolarCenterSync from "./internal/PolarCenterSync";
import type { RadarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { themeToVars } from "../utils/theme";

const props = defineProps<RadarChartProps<T>>();

/** One radar polygon per visible series in `categories`. */
const series = computed(() => categoriesToSeries(props.categories).filter((s) => !s.hidden));

const angleKey = computed(() => String(props.dataKey));
const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);
const themeVars = computed(() => themeToVars(props.theme));

const resolvedTickSize = computed(() => props.angleAxisTickSize ?? 18);

/** Legend-aware centre + radius budget, reported by `<PolarCenterSync>`. */
const center = ref<{ cx: number; cy: number; maxRadius: number }>();
const onCenter = (next: { cx: number; cy: number; maxRadius: number }) => {
  if (
    center.value?.cx === next.cx
    && center.value?.cy === next.cy
    && center.value?.maxRadius === next.maxRadius
  ) return;
  center.value = next;
};

/**
 * Room left between the polygon and the plot edge for one spoke label: the
 * tick line plus roughly half a label's width. Constant in pixels, because a
 * label doesn't get wider as the chart grows.
 */
const LABEL_ALLOWANCE = 30;

/** Ceiling on that inset for small charts, where a fixed 48px would swallow the polygon. */
const MAX_INSET_RATIO = 0.32;

/**
 * vccs defaults the polygon to 80% of the plot box and hangs the spoke labels
 * 8px off it, which crowds the top spoke label against the radius axis' top
 * tick. Pull the polygon in and push the labels out so both can breathe.
 *
 * The inset is sized in pixels rather than as a flat percentage: a percentage
 * grows with the box, so a tall chart spent an ever-larger empty ring on labels
 * that never needed it. Falls back to the old 68% until the offset reports.
 */
const resolvedOuterRadius = computed(() => {
  if (props.outerRadius !== undefined) return props.outerRadius;
  const maxRadius = center.value?.maxRadius;
  if (!maxRadius) return "68%";
  const inset = Math.min(maxRadius * MAX_INSET_RATIO, resolvedTickSize.value + LABEL_ALLOWANCE);
  return Math.max(maxRadius - inset, 1);
});
</script>

<template>
  <div class="vue-chrts" :style="themeVars">
  <ChartContainer width="100%" :height="height">
    <VccsRadarChart
      :data="data"
      :outer-radius="resolvedOuterRadius"
      :cx="center?.cx"
      :cy="center?.cy"
      :margin="margin ?? { top: 12, right: 12, bottom: 12, left: 12 }"
    >
      <PolarCenterSync :on-center="onCenter" />
      <PolarGrid stroke="var(--vc-grid-color)" />
      <PolarAngleAxis
        :data-key="angleKey"
        :tick-formatter="angleFormatter"
        :tick-size="resolvedTickSize"
        :tick-line="false"
      />
      <!--
        vccs defaults the radius axis to `angle: 0`, which lays the 0→max scale
        out horizontally to the right. Point it up instead so the scale reads
        bottom-to-top from the centre; `orientation: middle` then centres the
        tick labels on the axis line rather than hanging them off one side.
      -->
      <PolarRadiusAxis
        v-if="!hideRadiusAxis"
        :angle="radiusAxisAngle ?? 90"
        orientation="middle"
      />

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
  </ChartContainer>
  </div>
</template>
