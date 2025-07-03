<script setup lang="ts" generic="T extends {}">
import { computed, ComputedRef, createApp } from "vue";
import { GroupedBar, Orientation, StackedBar } from "@unovis/ts";

import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisStackedBar,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";
import { LegendPosition } from "../../types";
import { BarChartProps } from "./types";

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  orientation: Orientation.Vertical,
  LegendPosition: LegendPosition.Bottom,
  yGridLine: true,
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

if (!props.yAxis || props.yAxis.length === 0) {
  throw new Error("yAxis is required");
}

const yAxis: ComputedRef<((d: T) => T[keyof T])[]> = computed(() => {
  return props.yAxis.map((key) => (d: T) => {
    return d[key];
  });
});

const color = (_: T, i: number) => Object.values(props.categories)[i].color;

const LegendPositionTop = computed(
  () => props.legendPosition === LegendPosition.Top
);

const generateTooltip = computed(() => (d: T, idx: number) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }

  const keys = Object.keys(props.categories);
  const dataKeys = Object.keys(d);
  const key = dataKeys.find((key) => !keys.includes(key));

  try {
    const app = createApp(Tooltip, {
      data: d,
      categories: props.categories,
      toolTipTitle: d[key as keyof typeof d],
      yFormatter: props.yFormatter,
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

/* Example data instead of using props.data */
/* TODO: change example data in SocialDealExamples.vue to match structure below */
/* Write logic to check if stacked AND grouped properties are set to true */
/* If so add two VisGroupedBar like below to get a "stacked" grouped bar chart */

  const keys = Object.keys(props.data[0]).filter((key) => key !== "month");

const flattenData = (data) => {
  // Use the map method to iterate over each entry and return a new array
  // with the transformed objects.

  /* First get the keys of the provided data */

  const states = ["Done", "Pending"];

  return data.map((entry) => {
    return {
      month: entry.month,
      ...keys
        .flatMap((key) =>
          states.map((state) => ({
            [`${key}${state}`]: entry[key][state.toLowerCase()],
          }))
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
  });
};

const data = flattenData(props.data);

const bar1 = [(d) => d.desktopDone, (d) => d.mobileDone, (d) => d.androidDone, (d) => d.iosDone];

const bar2 = [
  (d) => d.desktopPending,
  (d) => d.mobilePending,
  (d) => d.androidPending,
  (d) => d.iosPending,
];
</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
  >
    <VisXYContainer :padding="padding" :height="height">
      <VisTooltip
        :triggers="{
          [GroupedBar.selectors.bar]: generateTooltip,
          [StackedBar.selectors.bar]: generateTooltip,
        }"
      />

      <VisGroupedBar
        :data="data"
        :x="(_: T, i: number) => i"
        :y="[
          (d) => d.desktopDone + d.mobileDone + d.androidDone + d.iosDone,
          (d) => d.desktopPending + d.mobilePending + d.androidPending + d.iosPending
        ]"
        :color="(_d, i) => ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'][i]"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisStackedBar
        :data="data"
        :x="(_: T, i: number) => i - 0.2"
        :y="bar1"
        :color="(_d, i) => ['#2B7FFF', '#EFB100', '#00C16A', '#AD46FF'][i]"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisStackedBar
        :data="data"
        :x="(_: T, i: number) => i + 0.2"
        :y="bar2"
        :color="(_d, i) => ['#8EC5FF', '#FFDF20', '#7FE0A8', '#D69FFF'][i]"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />

      <!-- <VisStackedBar
        v-else
        :data="data"
        :x="(_: T, i: number) => i"
        :y="yAxis"
        :color="color"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      /> -->
      <VisAxis
        v-if="!hideXAxis"
        type="x"
        :tick-format="xFormatter"
        :label="xLabel"
        :grid-line="xGridLine"
        :domain-line="!!xDomainLine"
        :tick-line="xTickLine"
        :num-ticks="xNumTicks"
        :tick-values="xExplicitTicks"
        :minMaxTicksOnly="minMaxTicksOnly"
      />
      <VisAxis
        v-if="!hideYAxis"
        type="y"
        :label="yLabel"
        :grid-line="orientation !== Orientation.Horizontal && yGridLine"
        :domain-line="!!yDomainLine"
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
