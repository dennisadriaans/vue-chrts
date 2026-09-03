<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * Radar chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Composes the `vccs` `<RadarChart>` with a `<PolarGrid>`, a `<PolarAngleAxis>`
 * bound to `dataKey` (the spoke labels) and a `<PolarRadiusAxis>`, plus one
 * `<Radar>` polygon per series defined in `categories`.
 */
import { computed, ref, useId } from "vue";
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
import ChartSkeleton from "./internal/ChartSkeleton.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import ChartDot from "./internal/ChartDot";
import { tooltipContentFor } from "./internal/tooltipContent";
import PolarCenterSync from "./internal/PolarCenterSync";
import RadarGradientDefs, { radarGradientId } from "./internal/RadarGradientDefs";
import type { RadarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { themeToVars } from "../utils/theme";

const props = defineProps<RadarChartProps<T>>();
const gradientScope = useId();

/** One radar polygon per visible series in `categories`. */
const series = computed(() => categoriesToSeries(props.categories).filter((s) => !s.hidden));

/**
 * `lines` drops the fill so several overlapping series stay readable — with
 * three or more filled polygons the lower ones disappear under the upper ones.
 */
const polygonFillOpacity = computed(() =>
  props.variant === "lines" ? 0 : isGradient.value ? 1 : (props.fillOpacity ?? 0.6),
);

const isGradient = computed(
  () => props.variant === "gradient" || props.variant === "gradient-reverse",
);

function polygonFill(dataKey: string, color: string): string {
  return isGradient.value ? `url(#${radarGradientId(dataKey, gradientScope)})` : color;
}

/** Truthy `dot` is what makes `vccs` call the `#dot` slot at all. */
const showDots = computed(() => props.dotVariant !== undefined);

const tooltipContent = computed(() =>
  tooltipContentFor(props.tooltipVariant, props.tooltipRoundness),
);

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
    <ChartSkeleton
      v-if="loading"
      :height="height ?? 200"
      shape="ring"
      :label="loadingLabel ?? 'Loading'"
    />
    <ChartContainer v-else width="100%" :height="height">
    <VccsRadarChart
      :data="data"
      :outer-radius="resolvedOuterRadius"
      :cx="center?.cx"
      :cy="center?.cy"
      :margin="margin ?? { top: 12, right: 12, bottom: 12, left: 12 }"
    >
      <PolarCenterSync :on-center="onCenter" />
      <RadarGradientDefs
        v-if="isGradient"
        :series="series"
        :variant="variant === 'gradient-reverse' ? 'gradient-reverse' : 'gradient'"
        :scope="gradientScope"
        :opacity="fillOpacity ?? 0.6"
      />
      <PolarGrid stroke="var(--vc-grid-color)" :grid-type="gridType ?? 'polygon'" />
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
        :fill="polygonFill(s.dataKey, s.color)"
        :fill-opacity="polygonFillOpacity"
        :dot="showDots"
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
      </Radar>

      <Tooltip v-if="!hideTooltip" :content="tooltipContent" :is-animation-active="false" />
      <Legend
        v-if="!hideLegend"
        :align="legend.align"
        :vertical-align="legend.verticalAlign"
        :layout="legend.layout"
        :wrapper-style="legendWrapperStyle"
      >
        <template #content="slotProps">
          <ChartLegend v-bind="slotProps" :variant="legendVariant" />
        </template>
      </Legend>
    </VccsRadarChart>
  </ChartContainer>
  </div>
</template>
