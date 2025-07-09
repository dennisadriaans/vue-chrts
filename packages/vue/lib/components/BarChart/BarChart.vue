<script setup lang="ts" generic="T extends {}">
import { computed, ComputedRef, ref, useSlots, useTemplateRef } from "vue";
import { GroupedBar, Orientation, StackedBar } from "@unovis/ts";
import { getFirstPropertyValue } from "../../utils";

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

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

if (!props.yAxis || props.yAxis.length === 0) {
  throw new Error("yAxis is required");
}

const yAxis: ComputedRef<((d: T) => T[keyof T])[]> = computed(() => {
  return props.yAxis.map((key) => (d: T) => {
    return d[key];
  });
});

const color = (_: T, i: number) => Object.values(props.categories)[i]?.color;

// For stackAndGrouped, we need to map the correct color for each bar accessor
const stackedGroupedColors1 = computed(() => Object.values(props.categories).slice(0, 4).map((c) => c.color));
const stackedGroupedColors2 = computed(() => Object.values(props.categories).slice(4, 8).map((c) => c.color));

// Helper to type the color function for VisStackedBar
const stackedColor1 = (_d: unknown, i: number) => stackedGroupedColors1.value[i] ?? '#ccc';
const stackedColor2 = (_d: unknown, i: number) => stackedGroupedColors2.value[i] ?? '#eee';

const LegendPositionTop = computed(
  () => props.legendPosition === LegendPosition.Top
);

function onCrosshairUpdate(d: T): string {
  hoverValues.value = d;
  return generateTooltipContent(d);
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

const keys = computed(() => {
  if (props.stackAndGrouped) {
    return Object.keys(props.data[0]).filter((key) => key !== "month");
  }
  return [];
});

const flattenData = (data: T[]) => {
  const states = ["Done", "Pending"];

  return data.map((entry: any) => {
    return {
      month: entry.month,
      ...keys.value
        .flatMap((key) =>
          states.map((state) => ({
            [`${key}${state}`]: entry[key][state.toLowerCase()],
          }))
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
  });
};

const chartData = computed(() => {
  if (props.stackAndGrouped) {
    return flattenData(props.data);
  }
  return props.data;
});

const bar1 = [
  (d: any) => d.desktopDone,
  (d: any) => d.mobileDone,
  (d: any) => d.androidDone,
  (d: any) => d.iosDone,
];

const bar2 = [
  (d: any) => d.desktopPending,
  (d: any) => d.mobilePending,
  (d: any) => d.androidPending,
  (d: any) => d.iosPending,
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
          [GroupedBar.selectors.bar]: onCrosshairUpdate,
          [StackedBar.selectors.bar]: onCrosshairUpdate,
        }"
      />
      <template v-if="stackAndGrouped">
        <VisStackedBar
          :data="chartData"
          :x="(_: T, i: number) => i - 0.2"
          :y="bar1"
          :color="stackedColor1"
          :rounded-corners="radius ?? 0"
          :group-padding="groupPadding ?? 0"
          :bar-padding="barPadding ?? 0.2"
          :orientation="orientation ?? Orientation.Vertical"
        />
        <VisStackedBar
          :data="chartData"
          :x="(_: T, i: number) => i + 0.2"
          :y="bar2"
          :color="stackedColor2"
          :rounded-corners="radius ?? 0"
          :group-padding="groupPadding ?? 0"
          :bar-padding="barPadding ?? 0.2"
          :orientation="orientation ?? Orientation.Vertical"
        />
      </template>
      <VisGroupedBar
        v-else-if="!stacked"
        :data="data"
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
        :data="data"
        :x="(_: T, i: number) => i"
        :y="yAxis"
        :color="color"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
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
      <VisBulletLegend :items="Object.values(props.categories)" />
    </div>

    <div ref="slotWrapper" class="hidden">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <Tooltip
          :data="hoverValues"
          :categories="props.categories"
          :toolTipTitle="getFirstPropertyValue(hoverValues) ?? ''"
          :yFormatter="props.orientation === Orientation.Horizontal ? props.xFormatter : props.yFormatter"
        />
      </slot>
    </div>
  </div>
</template>
