<script setup lang="ts" generic="T">
import { computed, createApp } from "vue";

import { CurveType, BulletLegendItemInterface, Position } from "@unovis/ts";

import {
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisXYContainer,
  VisTooltip,
} from "@unovis/vue";

import Tooltip from "./../Tooltip.vue";
import { PaginationPosition } from "../../types";

type LineChartProps<T> = {
  data: T[];
  height: number;
  xLabel?: string;
  yLabel?: string;
  categories: Record<string, BulletLegendItemInterface>;
  xFormatter: (i: number, idx: number) => string;
  yFormatter?: (i: number, idx: number) => string;
  curveType?: CurveType;
  yNumTicks?: number;
  xNumTicks?: number;
  paginationPosition?: PaginationPosition;
};

const props = defineProps<LineChartProps<T>>();

const color = (key: number) => Object.values(props.categories)[key].color;

const generateTooltip = computed(() => (d: T) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
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
    return '';
  }
});
</script>

<template>
  <div
    class="space-y-4 flex flex-col"
    :class="{
      'flex-col-reverse': props.paginationPosition === 'top',
    }"
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
        :num-ticks="xNumTicks ?? 4"
        :label="xLabel"
        :label-margin="8"
        :domain-line="false"
        :grid-line="false"
      />
      <VisAxis
        type="y"
        :num-ticks="yNumTicks ?? 4"
        :tick-format="yFormatter"
        :label="yLabel"
        :domain-line="false"
      />
      <VisCrosshair color="#666" :template="generateTooltip" />
    </VisXYContainer>
    <div class="flex items center justify-end">
      <VisBulletLegend :items="Object.values(categories)" />
    </div>
  </div>
</template>
