<script setup lang="ts" generic="T">
import { computed, createApp } from "vue";
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

const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  xNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
});

const colors = Object.values(props.categories).map((c) => c.color);

const generateTooltip = computed(() => (d: T) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }

  try {
    const app = createApp(Tooltip, {
      data: d,
      categories: props.categories,
    });

    const container = document.createElement("div");
    app.mount(container);

    const html = container.innerHTML;
    app.unmount();

    return html;
  } catch (error) {
    return "";
  }
});

function accessors(id: string): { y: NumericAccessor<T>; color: string } {
  return {
    y: (d: T) => Number(d[id as keyof typeof d]),
    color: props.categories[id]?.color ?? "#3b82f6",
  };
}

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
          :opacity="0.5"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
        <VisLine
          :x="(_: any, i: number) => i"
          :y="(d: T) => d[i as keyof typeof d]"
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
      class="flex items center justify-end"
      :class="{ 'pb-4': LegendPositionTop }"
    >
      <VisBulletLegend :items="Object.values(categories)" />
    </div>
  </div>
</template>
