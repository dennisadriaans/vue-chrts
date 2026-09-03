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
  Tooltip,
} from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartLegend from "./internal/ChartLegend.vue";
import ChartDot from "./internal/ChartDot";
import { tooltipContentFor } from "./internal/tooltipContent";
import type { RadarChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { themeToVars } from "../utils/theme";

const props = defineProps<RadarChartProps<T>>();

/** One radar polygon per visible series in `categories`. */
const series = computed(() => categoriesToSeries(props.categories).filter((s) => !s.hidden));

/**
 * `lines` drops the fill so several overlapping series stay readable — with
 * three or more filled polygons the lower ones disappear under the upper ones.
 */
const polygonFillOpacity = computed(() =>
  props.variant === "lines" ? 0 : (props.fillOpacity ?? 0.6),
);

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
</script>

<template>
  <div class="vue-chrts" :style="themeVars">
  <ChartContainer width="100%" :height="height">
    <VccsRadarChart :data="data">
      <PolarGrid stroke="var(--vc-grid-color)" :grid-type="gridType ?? 'polygon'" />
      <PolarAngleAxis :data-key="angleKey" :tick-formatter="angleFormatter" />
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
