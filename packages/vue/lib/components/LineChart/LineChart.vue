<script setup lang="ts" generic="T">
import { computed, createApp } from "vue";
import { CurveType, Position } from "@unovis/ts";

import {
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisXYContainer,
  VisTooltip,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";
import { LegendPosition } from "../../types";
import { LineChartProps } from "./types";

const props = withDefaults(defineProps<LineChartProps<T>>(), {
  padding: () => {
    return {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    };
  },
  xNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
});

const defaultColors = Object.values(props.categories).map((i, index) => `var(--vis-color${index})`)
const color = (key: number) => Object.values(props.categories)[key].color ?? defaultColors[key];


const generateTooltip = computed(() => (d: T, idx: number) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }

  try {
    const app = createApp(Tooltip, {
      data: d,
      categories: props.categories,
      xValue: props.xFormatter(Math.floor(idx)),
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

const LegendPositionTop = computed(
  () => props.legendPosition === LegendPosition.Top
);
</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
  >
    <VisXYContainer :data="data" :height="height">
      <VisTooltip
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />
      <template v-for="(i, iKey) in Object.keys(props.categories)" :key="iKey">
        <VisLine
          :x="(_: any, i: number) => i"
          :y="(d: T) => d[i as keyof typeof d]"
          :color="color(iKey)"
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
        :tick-line="xTickLine"
        :num-ticks="xNumTicks"
        :tick-values="xExplicitTicks"
        :min-max-ticks-only="minMaxTicksOnly"
      />
      <VisAxis
        type="y"
        :tick-format="yFormatter"
        :label="yLabel"
        :num-ticks="yNumTicks"
        :domain-line="yDomainLine"
        :grid-line="yGridLine"
        :tick-line="yTickLine"
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
