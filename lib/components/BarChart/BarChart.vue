<script setup lang="ts" generic="T">
import { computed, ComputedRef, createApp } from "vue";
import {
  BulletLegendItemInterface,
  GroupedBar,
  Orientation,
  StackedBar,
} from "@unovis/ts";

import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisStackedBar,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";

import Tooltip from "./../Tooltip.vue";
import { LegendPosition } from "../../types";
import { BarChartProps } from "./types";
import { getDistributedIndices } from "../../utils";

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  orientation: Orientation.Vertical,
  LegendPosition: LegendPosition.Bottom,
  yGridLine: true,
  xNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
});

const yAxis: ComputedRef<((d: T) => T[keyof T])[]> = computed(() => {
  return props.yAxis.map((key) => (d: T) => {
    return d[key];
  });
});

const color = (_: T, i: number) => Object.values(props.categories)[i].color;

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
</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
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
        :data="filteredDataByIndices"
        :x="(_: T, i: number) => i"
        :y="yAxis"
        :color="color"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisStackedBar
        v-else
        :data="filteredDataByIndices"
        :x="(_: T, i: number) => i"
        :y="yAxis"
        :color="color"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisAxis
        type="x"
        :num-ticks="filteredDataByIndices.length"
        :tick-format="props.orientation === Orientation.Horizontal ? xFormatter : (i: number, idx: number) => xFormatter(filteredDataByIndices[i], idx)"
        :label="xLabel"
        :grid-line="xGridLine"
        :domain-line="xDomainLine"
        :tick-line="xTickLine"
      />
      <VisAxis
        type="y"
        :label="yLabel"
        :grid-line="orientation !== Orientation.Horizontal && yGridLine"
        :domain-line="yDomainLine"
        :tick-format="yFormatter"
        :num-ticks="yNumTicks"
        :tick-line="yTickLine"
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
