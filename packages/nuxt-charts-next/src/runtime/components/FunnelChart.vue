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
  ResponsiveContainer,
  Tooltip,
} from "vccs";
import ChartTooltip from "./internal/ChartTooltip.vue";
import ChartLegend from "./internal/ChartLegend.vue";
import FunnelLayeredShape, {
  type FunnelLayeredDatum,
} from "./internal/FunnelLayeredShape.vue";
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
    color: cats[i]?.color ?? `var(--chart-color-${i})`,
  }));
});

const isLayered = computed(() => props.variant === "layered");

/** Enrich each stage with the geometry inputs {@link FunnelLayeredShape} needs. */
const layeredData = computed(() => {
  const maxValue = stages.value[0]?.value ?? 0;
  return stages.value.map((stage, stageIndex) => ({
    ...stage,
    stageIndex,
    stageCount: stages.value.length,
    maxValue,
    nextValue: stages.value[stageIndex + 1]?.value ?? stage.value,
  }));
});

const showValueLabel = computed(() => props.showValueLabel ?? true);
const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));

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
function hideTooltip() {
  activeDatum.value = null;
}
</script>

<template>
  <div
    v-if="isLayered"
    ref="chartContainer"
    class="funnel-layered"
    :style="{ height: `${height}px` }"
  >
    <ResponsiveContainer width="100%" height="100%">
      <VccsFunnelChart :margin="{ top: 16, right: 0, bottom: 8, left: 0 }">
        <Funnel
          :data="layeredData"
          data-key="value"
          name-key="name"
          last-shape-type="rectangle"
          :is-animation-active="duration !== undefined && duration !== 0"
        >
          <template #shape="shapeProps">
            <FunnelLayeredShape
              v-bind="shapeProps"
              @mouseenter="showTooltip"
              @mousemove="updateTooltipPosition"
              @mouseleave="hideTooltip"
            />
          </template>
        </Funnel>
      </VccsFunnelChart>
    </ResponsiveContainer>

    <div
      v-if="!hideTooltip && activeDatum"
      class="funnel-layered__tooltip"
      :style="{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }"
    >
      <span
        class="funnel-layered__dot"
        :style="{ background: activeDatum.color }"
      />
      <span class="funnel-layered__name">{{ activeDatum.name }}</span>
      <strong class="funnel-layered__value">{{
        activeDatum.value.toLocaleString()
      }}</strong>
    </div>
  </div>

  <ResponsiveContainer v-else width="100%" :height="height">
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

<style scoped>
.funnel-layered {
  position: relative;
  width: 100%;
}

.funnel-layered__tooltip {
  position: absolute;
  transform: translate(-50%, calc(-100% - 10px));
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  background: hsl(var(--popover, 0 0% 100%));
  border: 1px solid hsl(var(--border, 214.3 31.8% 91.4%));
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 0.75rem;
  color: hsl(var(--popover-foreground, 222.2 84% 4.9%));
  white-space: nowrap;
}

.funnel-layered__name {
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
}

.funnel-layered__value {
  font-variant-numeric: tabular-nums;
}

.funnel-layered__dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}
</style>
