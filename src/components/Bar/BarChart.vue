<script setup lang="ts" generic="T">
import { computed, ComputedRef, createApp } from "vue";
import { BulletLegendItemInterface, GroupedBar, Orientation, StackedBar } from "@unovis/ts";

import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisStackedBar,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";

import Tooltip from "./../Tooltip.vue";
import { PaginationPosition } from "../../types";

type BarChartProps<T> = {
  data: T[];
  stacked?: boolean;
  height: number;
  xLabel?: string;
  yLabel?: string;
  categories: Record<string, BulletLegendItemInterface>;
  xFormatter: (i: number, idx?: number) => string | number;
  yFormatter?: (i: number, idx?: number) => string | number;
  yNumTicks?: number;
  xNumTicks?: number;
  yAxis: (keyof T)[];
  groupPadding?: number;
  barPadding?: number;
  radius?: number;
  hideLegend?: boolean;
  orientation?: Orientation;
  paginationPosition?: PaginationPosition;
};

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  orientation: Orientation.Vertical,
  paginationPosition: PaginationPosition.Bottom,
});

const yAxis: ComputedRef<((d: T) => T[keyof T])[]> = computed(() => {
  return props.yAxis.map((key) => (d: T) => {
    return d[key];
  });
});

const color = (_: T, i: number) => Object.values(props.categories)[i].color;

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

const PaginationPositionTop = computed(
  () => props.paginationPosition === PaginationPosition.Top
);
</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': PaginationPositionTop }"
  >
    <VisXYContainer :height="height">
      <VisTooltip
        :triggers="{
          [GroupedBar.selectors.bar]: generateTooltip,
          [StackedBar.selectors.bar]: generateTooltip,
        }"
      />

      <VisGroupedBar
        v-if="!stacked"
        :data="data"
        :x="(_: T, i: number) => i"
        :y="yAxis"
        :grid-line="false"
        :domain-line="false"
        :color="color"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisStackedBar
        v-else
        :data="data"
        :x="(_: T, i: number) => i"
        :y="yAxis"
        :grid-line="false"
        :domain-line="false"
        :color="color"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisAxis
        type="x"
        :label="xLabel"
        :grid-line="false"
        :domain-line="false"
        :tick-format="xFormatter"
        :num-ticks="xNumTicks"
        :tick-line="false"
      />
      <VisAxis
        type="y"
        :label="yLabel"
        :grid-line="orientation !== Orientation.Horizontal"
        :domain-line="false"
        :tick-format="yFormatter"
      />
    </VisXYContainer>
    <div
      v-if="!hideLegend"
      class="flex items center justify-end"
      :class="{ 'pb-4': PaginationPositionTop }"
    >
      <VisBulletLegend :items="Object.values(categories)" />
    </div>
  </div>
</template>
