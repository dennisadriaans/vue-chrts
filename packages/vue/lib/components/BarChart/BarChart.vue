<script setup lang="ts" generic="T extends {}">
import { computed, ref, useSlots, useTemplateRef } from "vue";
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
  VisXYLabels,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";

import { LegendPosition } from "../../types";
import { BarChartProps } from "./types";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  orientation: Orientation.Vertical,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  hideLegend: false,
  yGridLine: true,
  groupPadding: 0,
  barPadding: 0.2,
  padding: () => ({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  }),
  hideTooltip: false,
  stackedGroupedSpacing: 0.1,
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

if (props.valueLabel && !props.xAxis) {
  throw new Error(
    "BarChart: 'xAxis' prop is required when 'valueLabel' is enabled. Please provide an 'xAxis' to display value labels."
  );
}

if (!props.yAxis || props.yAxis.length === 0) {
  throw new Error("yAxis is required");
}

const yAxis = computed(() => {
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

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function onCrosshairUpdate(d: T) {
  hoverValues.value = d;
}

const accessors = props.yAxis.map((i) => {
  return (d: any) => d[i];
});

const numBars = accessors.length;

interface LabelDatum {
  x: number;
  y: number;
  itemIndex: number;
}

const labelData: LabelDatum[] = props.data.flatMap((item, colIndex) =>
  accessors.map((yAccessor, itemIndex) => ({
    x: colIndex,
    y: Number(yAccessor(item) ?? 0),
    itemIndex,
  }))
);

// Compute label x-position so each value label sits centered over (or in front of) its own bar
// instead of the middle of the group. For stacked or stacked+grouped charts we leave the default.
// NOTE: We approximate group width as 1 (same assumption Unovis uses when x accessor returns index)
// and shrink by groupPadding (external) – this is a heuristic but yields visually correct alignment.
// If barPadding is large, Unovis internally adjusts bar widths; we ignore intra-bar padding here
// because labels should track bar centers, not gaps.
const labelX = (d: LabelDatum) => {
  // Do not offset for stacked variants
  if (props.stacked || props.stackAndGrouped) return d.x;
  const n = numBars;
  if (n <= 1) return d.x; // single series, already centered

  // Effective drawable width of the group after outer group padding (heuristic)
  const groupPaddingRatio = props.groupPadding ?? 0; // 0..1 proportion
  const groupEffectiveWidth = 1 - groupPaddingRatio;
  const barEffectiveWidth = groupEffectiveWidth / n;

  // Start (left) edge of effective group relative to group center (which is at d.x)
  // We treat group center as 0 and shift bars left by half the effective width.
  const leftOffsetFromCenter = -groupEffectiveWidth / 2;
  const barCenterOffset =
    barEffectiveWidth * d.itemIndex + barEffectiveWidth / 2;
  // Bars inside the group usually don't span the full theoretical width due to internal barPadding.
  // This caused first label to lean left edge and last to lean right edge. Compress offsets towards center.
  const barPaddingRatio = props.barPadding ?? 0; // 0..1
  const compression = 1 - barPaddingRatio; // pull towards center
  const offsetFromCenter =
    (leftOffsetFromCenter + barCenterOffset) * compression;

  return d.x + offsetFromCenter;
};
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
    @click="emit('click', $event, hoverValues)"
  >
    <VisXYContainer :padding="padding" :height="height">
      <VisXYLabels
        v-if="!!valueLabel"
        :data="labelData"
        :x="labelX"
        :y="(d: any) => d.y + (props.valueLabel?.labelSpacing ?? 0)"
        :label="props.valueLabel?.label"
        :backgroundColor="props.valueLabel?.backgroundColor ?? 'transparent'"
        :color="props.valueLabel?.color ?? 'red'"
        :labelFontSize="props.valueLabel?.labelFontSize"
      />

      <VisTooltip
        :triggers="{
          [GroupedBar.selectors.bar]: (d: T) => {
            onCrosshairUpdate(d);
            return d ? slotWrapperRef?.innerHTML : '';
          },
          [StackedBar.selectors.bar]: (d: T) => {
            onCrosshairUpdate(d);
            return d ? slotWrapperRef?.innerHTML : '';
          },
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
        v-bind="xAxisConfig"
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
        v-bind="yAxisConfig"
      />
    </VisXYContainer>
    
    <div
      v-if="!props.hideLegend"
      :style="{
        display: 'flex',
        justifyContent: legendAlignment,
      }"
    >
      <VisBulletLegend
        :style="[
          props.legendStyle,
          'display: flex; gap: var(--vis-legend-spacing);',
        ]"
        :items="
          Object.values(props.categories).map((item) => ({
            ...item,
            color: Array.isArray(item.color) ? item.color[0] : item.color,
          }))
        "
      />
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
