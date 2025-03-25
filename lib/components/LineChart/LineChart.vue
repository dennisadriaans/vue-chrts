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

import Tooltip from "./../Tooltip.vue";
import { LegendPosition } from "../../types";
import { LineChartProps } from "./types";
import { getDistributedIndices } from "../../utils";

const props = withDefaults(defineProps<LineChartProps<T>>(), {
  xNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
});

const color = (key: number) => Object.values(props.categories)[key].color;

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

const LegendPositionTop = computed(
  () => props.legendPosition === LegendPosition.Top
);

const tickIndices = computed(() =>
  getDistributedIndices(props.data.length, props.xNumTicks)
);

const filteredDataByIndices = computed(() => {
  if (!props.data?.length || !tickIndices || tickIndices.value.length === 0) {
    return [];
  }
  return tickIndices.value.map((index) => props.data[index]);
});
</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
  >
    <VisXYContainer :data="filteredDataByIndices" :height="height">
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
        :num-ticks="filteredDataByIndices.length"
        :tick-format="(i: number, idx: number) => xFormatter(filteredDataByIndices[i], idx)"
        :label="xLabel"
        :label-margin="8"
        :domain-line="xDomainLine"
        :grid-line="xGridLine"
      />
      <VisAxis
        type="y"
        :tick-format="yFormatter"
        :label="yLabel"
        :num-ticks="yNumTicks"
        :domain-line="yDomainLine"
        :grid-line="yGridLine"
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
