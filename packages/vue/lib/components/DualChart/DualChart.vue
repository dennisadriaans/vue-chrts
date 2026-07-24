<script setup lang="ts" generic="T extends {}">
import { computed, useSlots } from "vue";
import { GroupedBar, StackedBar, Orientation, CurveType, Position } from "@unovis/ts";
import { useHoverTooltip } from "../../composables/useHoverTooltip";

import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisStackedBar,
  VisLine,
  VisTooltip,
  VisXYContainer,
  VisCrosshair,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";

import { LegendPosition } from "../../enums";
import { DualChartProps } from "./DualChart";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

const props = withDefaults(defineProps<DualChartProps<T>>(), {
  duration: 600,
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
  lineWidth: 2,
  curveType: CurveType.MonotoneX,
  tooltip: () => ({
    followCursor: true,
  }),
});

const slots = useSlots();
const { slotWrapperRef, hoverValues, setHoveredRow } = useHoverTooltip<T>(
  () => props.data
);

// Validate required props
if (!props.barYAxis || props.barYAxis.length === 0) {
  console.error('[DualChart] barYAxis prop is required and must contain at least one field key');
  throw new Error("DualChart: 'barYAxis' is required and must contain at least one field key. Provide an array of property keys from your data type (e.g., ['revenue', 'costs'])");
}

if (!props.lineYAxis || props.lineYAxis.length === 0) {
  console.error('[DualChart] lineYAxis prop is required and must contain at least one field key');
  throw new Error("DualChart: 'lineYAxis' is required and must contain at least one field key. Provide an array of property keys from your data type (e.g., ['profit', 'target'])");
}

// Bar chart accessors
const barYAxisAccessors = computed(() => {
  return props.barYAxis.map((key) => (d: T) => {
    return d[key];
  });
});

// Line chart accessors
const lineYAxisAccessors = computed(() => {
  return props.lineYAxis.map((key) => (d: T) => {
    return d[key];
  });
});

// Bar color accessor
const barColor = (_: T, i: number) => Object.values(props.barCategories)[i]?.color;

// Line color accessor
const lineColor = (_: T, i: number) => Object.values(props.lineCategories)[i]?.color;

// Combined categories for legend
const allCategories = computed(() => ({
  ...props.barCategories,
  ...props.lineCategories,
}));

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function onCrosshairUpdate(d: T) {
  hoverValues.value = d;
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

function onCrosshairUpdateWithContent(d: T): string {
  hoverValues.value = d;
  return generateTooltipContent(d);
}

// Must be a stable object reference (not created inline in the template).
// `@unovis/vue`'s VisTooltip wrapper deep-compares its forwarded props on every
// render, and a *new* `triggers` object (with new function closures) on every
// render — which happens whenever `data`/`barYAxis`/etc. change — reads as
// "props changed", causing it to call the underlying tooltip's `.render()`
// with no arguments, which clears its content to "". That happens even with
// the mouse sitting still, with no new hover at all.
// The `setHoveredRow` calls let `useHoverTooltip` keep the tooltip content
// live if `data` changes while the mouse sits still over a bar (bars are
// positioned by array index, `x: (_, i) => i`, same as Unovis itself uses).
const tooltipTriggers = {
  [GroupedBar.selectors.bar]: (d: T) => {
    setHoveredRow(props.data, d);
    onCrosshairUpdate(d);
    return d ? slotWrapperRef.value?.innerHTML : "";
  },
  // Unovis's StackedBar (unlike GroupedBar) binds each bar to a D3
  // stack-layout wrapper object (`{ datum: row, index, stacked, stackIndex }`),
  // not the row itself — the real row lives under `.datum`.
  [StackedBar.selectors.bar]: (wrapper: { datum: T }) => {
    const row = wrapper?.datum ?? (wrapper as unknown as T);
    setHoveredRow(props.data, row);
    onCrosshairUpdate(row);
    return row ? slotWrapperRef.value?.innerHTML : "";
  },
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
    <VisXYContainer
      :padding="padding"
      :height="height"
      :duration="duration"
      :data="data"
      :x-domain="xDomain"
      :y-domain="yDomain"
    >
      <VisTooltip
        ref="tooltip"
        v-if="!hideTooltip"
        :followCursor="props.tooltip?.followCursor"
        :show-delay="props.tooltip?.showDelay"
        :hide-delay="props.tooltip?.hideDelay"
        :triggers="tooltipTriggers"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />

      <!-- Bar Chart Component -->
      <VisGroupedBar
        v-if="!stacked"
        :data="data"
        :x="(_: T, i: number) => i"
        :y="barYAxisAccessors"
        :color="barColor"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisStackedBar
        v-else
        :data="data"
        :x="(_: T, i: number) => i"
        :y="barYAxisAccessors"
        :color="barColor"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />

      <!-- Line Chart Component(s) -->
      <VisLine
        v-for="(lineAccessor, index) in lineYAxisAccessors"
        :key="`line-${index}`"
        :data="data"
        :x="(_: T, i: number) => i"
        :y="lineAccessor"
        :color="Object.values(props.lineCategories)[index]?.color"
        :curve-type="curveType ?? CurveType.MonotoneX"
        :line-width="lineWidth"
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
        :duration="duration"
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
        :duration="duration"
        v-bind="yAxisConfig"
      />

      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdateWithContent"
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
          Object.values(allCategories).map((item) => ({
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
          :categories="allCategories"
          :title-formatter="props.tooltipTitleFormatter"
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
