<script setup lang="ts" generic="T extends {}">
import { computed, ComputedRef, ref, useSlots, useTemplateRef } from "vue";
import { GroupedBar, Orientation, StackedBar } from "@unovis/ts";
import { getFirstPropertyValue } from "../../utils";
import { useStackedGrouped } from "./stackedGroupedUtils";

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

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

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
  xNumTicks: (props: BarChartProps<T>) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  yNumTicks: (props: BarChartProps<T>) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  hideTooltip: false,
  stackedGroupedSpacing: 0.1,
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

const stackedGroupedData = computed(
  () =>
    useStackedGrouped({
      data: props.data,
      categories: props.categories,
      stackAndGrouped: props.stackAndGrouped,
      xAxis: props.xAxis,
      spacing: props.stackedGroupedSpacing,
    }).value
);

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
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: LegendPositionTop ? 'column-reverse' : 'column',
      gap: '1rem',
    }"
    @click="emit('click', $event, hoverValues)"
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
          v-for="state in stackedGroupedData.states"
          :key="state"
          :data="stackedGroupedData.chartData"
          :x="(_: T, i: number) => i + stackedGroupedData.positions[state]"
          :y="stackedGroupedData.bars[state]"
          :color="stackedGroupedData.colorFunctions[state]"
          :rounded-corners="radius ?? 0"
          :group-padding="groupPadding ?? 0"
          :bar-padding="barPadding"
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
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: LegendPositionTop ? '1rem' : undefined,
      }"
    >
      <VisBulletLegend :items="Object.values(props.categories)" />
    </div>

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <Tooltip
          :data="hoverValues"
          :categories="props.categories"
          :toolTipTitle="getFirstPropertyValue(hoverValues) ?? ''"
          :yFormatter="
            props.orientation === Orientation.Horizontal
              ? props.xFormatter
              : props.yFormatter
          "
        />
      </slot>
    </div>
  </div>
</template>
