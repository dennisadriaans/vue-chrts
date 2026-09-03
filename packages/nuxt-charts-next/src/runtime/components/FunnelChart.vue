<script setup lang="ts" generic="T">
/**
 * Funnel chart adapter. New in v3 (no `nuxt-charts` v2 equivalent).
 *
 * Like {@link DonutChart}, takes a positional `number[]` aligned with
 * `categories`. Each value becomes one stage; colours come from `categories`.
 *
 * Two variants:
 * - `default` — classic `vccs` trapezoid funnel with an optional `<LabelList>`.
 * - `layered` — curved, nested layers drawn via the `<Funnel>` `#shape` slot
 *   (see {@link FunnelLayeredShape}) with on-shape labels and a positioned
 *   tooltip.
 */
import { computed, ref, useTemplateRef } from "vue";
import {
  Funnel,
  FunnelChart as VccsFunnelChart,
  LabelList,
  Legend,
  Tooltip,
} from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import FunnelLayeredShape, {
  type FunnelLayeredDatum,
} from "./internal/FunnelLayeredShape.vue";
import type { FunnelChartProps } from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../utils/legend";
import { toCssProperties } from "../utils/style";
import { themeToVars } from "../utils/theme";

const props = withDefaults(defineProps<FunnelChartProps<T>>(), {
  showValueLabel: true,
  showPercentage: true,
});

const themeVars = computed(() => themeToVars(props.theme));

/** Zip the value array against the categories record (positional, matching Donut). */
const stages = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((value, i) => ({
    name: cats[i]?.name ?? String(i),
    value,
    fill: cats[i]?.color ?? `var(--chart-color-${i})`,
    color: cats[i]?.color ?? `var(--chart-color-${i})`,
  }));
});

const isLayered = computed(() => props.variant === "layered");

const showValueLabel = computed(() => props.showValueLabel ?? true);

const NAMED_LABEL_SIZES = { sm: 10, md: 12, lg: 14 } as const;

/** `undefined` means "auto-fit", which only the shape can resolve — it needs its own geometry. */
function toPixels(size: "auto" | "sm" | "md" | "lg" | number | undefined) {
  if (size === undefined || size === "auto") return undefined;
  return typeof size === "number" ? size : NAMED_LABEL_SIZES[size];
}

const labelSizes = computed(() => {
  const size = props.labelSize;
  const perRole = typeof size === "object" ? size : undefined;
  return {
    base: toPixels(perRole ? perRole.base : size),
    value: perRole?.value,
    percentage: perRole?.percentage,
    name: perRole?.name,
  };
});

/** Enrich each stage with the geometry inputs {@link FunnelLayeredShape} needs. */
const layeredData = computed(() => {
  const maxValue = stages.value[0]?.value ?? 0;
  return stages.value.map((stage, stageIndex) => ({
    ...stage,
    stageIndex,
    stageCount: stages.value.length,
    maxValue,
    nextValue: stages.value[stageIndex + 1]?.value ?? stage.value,
    labelSizes: labelSizes.value,
    showValue: showValueLabel.value,
    showPercentage: props.showPercentage ?? true,
  }));
});

/** The default variant's `<LabelList>` has no badge geometry, so CSS can own its size. */
const defaultLabelStyle = computed(() => {
  const size = labelSizes.value.value ?? labelSizes.value.base;
  return size === undefined ? undefined : { "--vc-funnel-value-size": `${size}px` };
});
const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() =>
  resolveLegendWrapperStyle(props.legendPosition, toCssProperties(props.legendStyle)),
);

// --- layered tooltip (positioned, follows the cursor) ---
const chartContainer = useTemplateRef<HTMLElement>("chartContainer");
const activeDatum = ref<FunnelLayeredDatum | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });

function updateTooltipPosition(event: MouseEvent) {
  const bounds = chartContainer.value?.getBoundingClientRect();
  if (!bounds) return;
  tooltipPosition.value = {
    x: Math.min(Math.max(event.clientX - bounds.left, 8), bounds.width - 8),
    y: Math.min(Math.max(event.clientY - bounds.top, 8), bounds.height - 8),
  };
}
function showTooltip(event: MouseEvent, datum: FunnelLayeredDatum) {
  activeDatum.value = datum;
  updateTooltipPosition(event);
}
function clearTooltip() {
  activeDatum.value = null;
}
</script>

<template>
  <div
    v-if="isLayered"
    ref="chartContainer"
    class="vc-funnel-layered vue-chrts"
    :style="{ height: `${height}px`, ...themeVars }"
  >
    <ChartContainer width="100%" height="100%">
      <VccsFunnelChart :margin="{ top: 16, right: 0, bottom: 8, left: 0 }">
        <Funnel
          :data="layeredData"
          data-key="value"
          name-key="name"
          last-shape-type="rectangle"
          stroke="none"
          :is-animation-active="duration !== undefined && duration !== 0"
        >
          <template #shape="shapeProps">
            <!--
              Bind only what the shape reads. vccs also passes fill/stroke
              (`stroke` defaults to `#fff`); those fall through onto the root
              `<g>` and SVG-inherit onto every label, stroking the glyphs so
              they read as extra-bold. CSS `font-weight` cannot undo that.
            -->
            <FunnelLayeredShape
              :payload="shapeProps.payload"
              :parent-view-box="shapeProps.parentViewBox"
              @mouseenter="showTooltip"
              @mousemove="updateTooltipPosition"
              @mouseleave="clearTooltip"
            />
          </template>
        </Funnel>
      </VccsFunnelChart>
    </ChartContainer>

    <div
      v-if="!props.hideTooltip && activeDatum"
      class="vc-funnel-layered__tooltip"
      :style="{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }"
    >
      <span
        class="vc-funnel-layered__dot"
        :style="{ background: activeDatum.color }"
      />
      <span class="vc-funnel-layered__name">{{ activeDatum.name }}</span>
      <strong class="vc-funnel-layered__value">{{
        activeDatum.value.toLocaleString()
      }}</strong>
    </div>
  </div>

  <div v-else class="vc-funnel vue-chrts" :style="{ ...themeVars, ...defaultLabelStyle }">
  <ChartContainer width="100%" :height="height">
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
  </ChartContainer>
  </div>
</template>
