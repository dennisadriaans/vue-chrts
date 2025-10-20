<script setup lang="ts" generic="T">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import { type NumericAccessor, CurveType, Position } from "@unovis/ts";
import { createMarkers, getFirstPropertyValue } from "../../utils";

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

const colors = computed(() => {
  if (!props.categories) return [];
  const defaultColors = Object.values(props.categories).map(
    (_, index) => `var(--vis-color${index})`
  );
  return Object.values(props.categories).map(
    (c, i) => c.color ?? defaultColors[i]
  );
});

const markersSvgDefs = computed(() => {
  if (!props.markerConfig) return "";
  return createMarkers(props.markerConfig);
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

function onCrosshairUpdate(d: T) {
  hoverValues.value = d;
}
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
    :class="{ markers: !!props.markerConfig }"
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

      <VisCrosshair v-if="!hideTooltip" v-bind="crosshairConfig" @update="onCrosshairUpdate" />
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
          :toolTipTitle="getFirstPropertyValue(hoverValues) ?? ''"
          :yFormatter="props.yFormatter"
        />
      </slot>
    </div>
  </div>
</template>
