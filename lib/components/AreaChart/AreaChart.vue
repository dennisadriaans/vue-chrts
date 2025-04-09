<script setup lang="ts" generic="T">
import { computed, createApp, ref, onUnmounted } from "vue";
import { type NumericAccessor, CurveType, Position } from "@unovis/ts";
import {
  VisArea,
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";

import Tooltip from "./../Tooltip.vue";
import { LegendPosition } from "../../types";
import { AreaChartProps } from "./types";
import { oklch2web } from "oklch-colors";
import { convertCategories, getColorValue, getOklchFromCssVariable } from "../../colors";

// Constants for default values
const DEFAULT_TICK_COUNT = 24;
const DEFAULT_TICK_DIVISOR = 4;
const DEFAULT_OPACITY = 0.5;
const DEFAULT_COLOR = "#3b82f6";

const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  xNumTicks: (props) =>
    props.data.length > DEFAULT_TICK_COUNT
      ? DEFAULT_TICK_COUNT / DEFAULT_TICK_DIVISOR
      : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > DEFAULT_TICK_COUNT
      ? DEFAULT_TICK_COUNT / DEFAULT_TICK_DIVISOR
      : props.data.length - 1,
});

const colors = Object.values(props.categories).map((c: any) =>
  getColorValue(c.color, oklch2web)
);

const parsedColors = Object.values(props.categories).map((category) => {
  if (category.color?.includes("#")) return category;

  const primaryOklchValues = getOklchFromCssVariable(category.color!);
  if (!primaryOklchValues) return { ...category, color: DEFAULT_COLOR };

  return {
    ...category,
    color: oklch2web(
      primaryOklchValues.l,
      primaryOklchValues.c,
      primaryOklchValues.h
    ),
  };
});

function accessors(id: string): { y: NumericAccessor<T>; color: string } {
  return {
    y: (d: T) => Number(d[id as keyof T]),
    color: props.categories[id]?.color ?? DEFAULT_COLOR,
  };
}

const tooltipApp = ref<ReturnType<typeof createApp> | null>(null);
const tooltipContainer = ref<HTMLDivElement | null>(null);

const generateTooltip = computed(() => (d: T) => {
  if (typeof window === "undefined") return "";

  if (!tooltipContainer.value) {
    tooltipContainer.value = document.createElement("div");
  }

  const convertedCategories = convertCategories(props.categories, oklch2web);

  try {
    if (!tooltipApp.value) {
      tooltipApp.value = createApp(Tooltip, {
        data: d,
        categories: convertedCategories,
      });
      tooltipApp.value.mount(tooltipContainer.value);
      return tooltipContainer.value.innerHTML;
    }

    const instance = tooltipApp.value._instance;
    if (!instance?.proxy) return tooltipContainer.value.innerHTML;

    return tooltipContainer.value.innerHTML;
  } catch (error) {
    console.error("Error generating tooltip:", error);
    return "";
  }
});

onUnmounted(() => {
  if (tooltipApp.value) {
    tooltipApp.value.unmount();
    tooltipApp.value = null;
  }
  tooltipContainer.value = null;
});

const svgDefs = colors
  .map(
    (color, index) => `
  <linearGradient id="gradient${index}-${color}" gradientTransform="rotate(90)">
    <stop offset="0%" stop-color="${color}" stop-opacity="1" />
    <stop offset="100%" stop-color="${color}" stop-opacity="0" />
  </linearGradient>
`
  )
  .join("");

const LegendPositionTop = computed(
  () => props.legendPosition === LegendPosition.Top
);
</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
  >
    <VisXYContainer :data="data" :height="height" :svg-defs="svgDefs">
      <VisTooltip
        v-if="!hideTooltip"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />
      <template v-for="(i, iKey) in Object.keys(props.categories)" :key="iKey">
        <VisArea
          :x="(_: T, i: number) => i"
          v-bind="accessors(i)"
          :color="`url(#gradient${iKey}-${colors[iKey]})`"
          :opacity="DEFAULT_OPACITY"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
        <VisLine
          :x="(_: T, i: number) => i"
          :y="(d: T) => d[i as keyof T]"
          :color="colors[iKey]"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
      </template>

      <VisAxis
        type="x"
        :tick-format="xFormatter"
        :label="xLabel"
        :label-margin="8"
        :domain-line="xDomainLine"
        :grid-line="xGridLine"
        :num-ticks="xNumTicks"
        :tick-line="xTickLine"
        :tick-values="xExplicitTicks"
        :min-max-ticks-only="minMaxTicksOnly"
      />
      <VisAxis
        type="y"
        :num-ticks="yNumTicks"
        :tick-format="yFormatter"
        :label="yLabel"
        :grid-line="yGridLine"
        :domain-line="yDomainLine"
        :tick-line="!!yGridLine"
      />
      <VisCrosshair
        v-if="!hideTooltip"
        color="#666"
        :template="generateTooltip"
      />
    </VisXYContainer>
    <div
      v-if="!hideLegend"
      class="flex items-center justify-end"
      :class="{ 'pb-4': LegendPositionTop }"
    >
      <VisBulletLegend :items="parsedColors" />
    </div>
  </div>
</template>
