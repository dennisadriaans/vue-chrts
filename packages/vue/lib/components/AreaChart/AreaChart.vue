<script setup lang="ts" generic="T">
import { computed, getCurrentInstance, onMounted, ref, useSlots, useTemplateRef } from "vue";
import { type NumericAccessor, CurveType, Position } from "@unovis/ts";
import { createScopedMarkers } from "../../utils";

import Tooltip from "../Tooltip.vue";

import {
  VisArea,
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";

import { LegendPosition } from "../../types";

import type { AreaChartProps } from "./types";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

const DEFAULT_OPACITY = 0.5;
const DEFAULT_COLOR = "#3b82f6";
const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  padding: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  crosshairConfig: () => ({
    color: "#666",
  }),
  lineWidth: 2,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  hideLegend: false,
  hideArea: false,
  gradientStops: () => [
    { offset: "0%", stopOpacity: 1 },
    { offset: "75%", stopOpacity: 0 },
  ],
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

const markerScopeId = `area-${getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2)}`;

const colors = computed(() => {
  const defaultColors = Object.values(props.categories).map(
    (_, index) => `var(--vis-color${index})`
  );
  return Object.values(props.categories).map(
    (c, i) => c.color ?? defaultColors[i]
  );
});

const markersSvgDefs = computed(() => {
  if (!props.markerConfig?.config) return "";
  return createScopedMarkers(props.markerConfig, markerScopeId, {
    includeLegacy: true,
  });
});

const markerCssVars = computed<Record<string, string>>(() => {
  if (!props.markerConfig?.config) return {};

  const vars: Record<string, string> = {};
  for (const key of Object.keys(props.markerConfig.config)) {
    vars[`--vis-marker-${key}`] = `url(\"#${props.markerConfig.id}--${markerScopeId}--${key}\")`;
  }
  return vars;
});

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

const svgDefs = computed(() => {
  const createGradientWithHex = (id: number, color: string | string[]) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">
      ${
        props.gradientStops
          ?.map(
            (stop) =>
              `<stop offset="${stop.offset}" stop-color="${color}" stop-opacity="${stop.stopOpacity}" />`
          )
          .join("") ?? ""
      }
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  `;
  const createGradientWithCssVar = (id: number, color: string | string[]) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">

    ${
      props.gradientStops
        ?.map(
          (stop) => `
      <stop offset="${stop.offset}" style="stop-color:var(${color});stop-opacity:${stop.stopOpacity}" />
    `
        )
        .join("") ?? ""
    }
    </linearGradient>
  `;
  return colors.value
    .map((color, index) =>
      color?.includes("#")
        ? createGradientWithHex(index, color)
        : createGradientWithCssVar(index, color ?? DEFAULT_COLOR)
    )
    .join("");
});

function getAccessors(id: string): {
  y: NumericAccessor<T>;
  color: string | string[];
} {
  return {
    y: (d: T) => Number(d[id as keyof T]),
    color: props.categories[id]?.color ?? DEFAULT_COLOR,
  };
}

// Stacked area accessors - returns an array of y accessors for all categories
const stackedYAccessors = computed(() => {
  return Object.keys(props.categories).map(
    (categoryId) => (d: T) => Number(d[categoryId as keyof T])
  );
});

// Stacked line accessors - returns cumulative values for proper line positioning
const stackedLineYAccessors = computed(() => {
  const categoryKeys = Object.keys(props.categories);
  return categoryKeys.map((_, index) => {
    return (d: T) => {
      // Sum all values from index 0 to current index (cumulative)
      let sum = 0;
      for (let i = 0; i <= index; i++) {
        sum += Number(d[categoryKeys[i] as keyof T]) || 0;
      }
      return sum;
    };
  });
});

// Stacked color accessor - returns color based on index
const stackedColorAccessor = computed(() => {
  return (_d: T, i: number) => colors.value[i] ?? DEFAULT_COLOR;
});

function generateTooltipContent(d: T): string {
  if (typeof window === "undefined") {
    return "";
  }
  if (slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }
  return "";
}

function onCrosshairUpdate(d: T): string {
  hoverValues.value = d;
  return generateTooltipContent(d);
}
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
      ...markerCssVars,
    }"
    :class="{ 'stacked-area-chart': stacked }"
    :id="markerConfig?.id"
    @click="emit('click', $event, hoverValues)"
  >
    <VisXYContainer
      :data="data"
      :height="height"
      :padding="padding"
      :svg-defs="svgDefs + markersSvgDefs"
      :y-domain="yDomain"
      :x-domain="xDomain"
    >
      <VisTooltip
        v-if="!hideTooltip"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />

      <!-- Stacked Area Mode: Single VisArea with array of y accessors -->
      <template v-if="stacked">
        <VisArea
          :x="(_: T, i: number) => i"
          :y="stackedYAccessors"
          :color="stackedColorAccessor"
          :opacity="hideArea ? 0 : DEFAULT_OPACITY"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
        <VisLine
          :x="(_: T, i: number) => i"
          :y="stackedLineYAccessors"
          :color="stackedColorAccessor"
          :curve-type="curveType ?? CurveType.MonotoneX"
          :line-width="lineWidth"
        />
      </template>

      <!-- Non-Stacked Mode: Overlapping areas (original behavior) -->
      <template v-else>
        <template
          v-for="(categoryId, index) in Object.keys(props.categories)"
          :key="categoryId"
        >
          <VisArea
            :x="(_: T, i: number) => i"
            v-bind="getAccessors(categoryId)"
            :color="`url(#gradient${index}-${colors[index]})`"
            :opacity="hideArea ? 0 : DEFAULT_OPACITY"
            :curve-type="curveType ?? CurveType.MonotoneX"
          />
          <VisLine
            :x="(_: T, i: number) => i"
            :y="(d: T) => d[categoryId as keyof T]"
            :color="colors[index]"
            :curve-type="curveType ?? CurveType.MonotoneX"
            :line-width="lineWidth"
            :lineDashArray="lineDashArray ? lineDashArray[index] : undefined"
          />
        </template>
      </template>

      <VisAxis
        v-if="!hideXAxis"
        type="x"
        :label="xLabel"
        :label-margin="8"
        :num-ticks="xNumTicks"
        :tick-format="xFormatter"
        :tick-values="xExplicitTicks"
        :grid-line="xGridLine"
        :domain-line="xDomainLine"
        :tick-line="xTickLine"
        :min-max-ticks-only="minMaxTicksOnly"
        v-bind="xAxisConfig"
      />

      <VisAxis
        v-if="!hideYAxis"
        type="y"
        :label="yLabel"
        :num-ticks="yNumTicks"
        :tick-format="yFormatter"
        :grid-line="yGridLine"
        :domain-line="yDomainLine"
        :tick-line="yTickLine"
        v-bind="yAxisConfig"
      />

      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdate"
      />
    </VisXYContainer>

    <div
      v-if="!props.hideLegend"
      :style="{
        display: 'flex',
        justifyContent: legendAlignment,
      }"
    >
      <VisBulletLegend
        :style="[
          props.legendStyle,
          'display: flex; gap: var(--vis-legend-spacing);',
        ]"
        :items="
          Object.values(props.categories).map((item) => ({
            ...item,
            color: Array.isArray(item.color) ? item.color[0] : item.color,
          }))
        "
      />
    </div>

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <Tooltip
          :data="hoverValues"
          :categories="categories"
          :title-formatter="props.tooltipTitleFormatter"
          :yFormatter="props.yFormatter"
        />
      </slot>
    </div>
  </div>
</template>

