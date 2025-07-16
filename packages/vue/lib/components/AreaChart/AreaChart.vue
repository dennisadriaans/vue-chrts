<script setup lang="ts" generic="T">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import { type NumericAccessor, CurveType, Position } from "@unovis/ts";
import { getFirstPropertyValue } from "../../utils";

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

const DEFAULT_TICK_COUNT = 24;
const DEFAULT_TICK_DIVISOR = 4;
const DEFAULT_OPACITY = 0.5;
const DEFAULT_COLOR = "#3b82f6";
const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  padding: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  xNumTicks: (props) =>
    props.data.length > DEFAULT_TICK_COUNT
      ? DEFAULT_TICK_COUNT / DEFAULT_TICK_DIVISOR
      : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > DEFAULT_TICK_COUNT
      ? DEFAULT_TICK_COUNT / DEFAULT_TICK_DIVISOR
      : props.data.length - 1,
  lineWidth: 2,
  crosshairConfig: () => ({
    color: "#666",
  })
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

const colors = computed(() =>
  Object.values(props.categories).map((c) => c.color)
);

const isLegendTop = computed(() => props.legendPosition === LegendPosition.Top);

const svgDefs = computed(() => {
  const createGradientWithHex = (id: number, color: string) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="${color}" stop-opacity="1" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  `;
  const createGradientWithCssVar = (id: number, color: string) => `
    <linearGradient id="gradient${id}-${color}" gradientTransform="rotate(90)">
      <stop offset="0%" style="stop-color:var(--vis-color0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:var(--vis-color0);stop-opacity:0" />
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

function getAccessors(id: string): { y: NumericAccessor<T>; color: string } {
  return {
    y: (d: T) => Number(d[id as keyof T]),
    color: props.categories[id]?.color ?? DEFAULT_COLOR,
  };
}

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
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': isLegendTop }"
    @click="emit('click', $event, hoverValues)"
  >
    <VisXYContainer
      :data="data"
      :height="height"
      :padding="padding"
      :svg-defs="svgDefs"
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
          :opacity="DEFAULT_OPACITY"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
        <VisLine
          :x="(_: T, i: number) => i"
          :y="(d: T) => d[categoryId as keyof T]"
          :color="colors[index]"
          :curve-type="curveType ?? CurveType.MonotoneX"
          :line-width="lineWidth"
          :lineDashArray="lineDashArray"
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
      />

      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdate"
      />
    </VisXYContainer>

    <div
      v-if="!hideLegend"
      class="flex items-center justify-end"
      :class="{ 'pb-4': isLegendTop }"
    >
      <VisBulletLegend :items="Object.values(categories)" />
    </div>

    <div ref="slotWrapper" class="hidden">
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
