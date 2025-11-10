<script setup lang="ts" generic="T">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import { Position, Scatter } from "@unovis/ts";
import {
  VisXYContainer,
  VisScatter,
  VisAxis,
  VisTooltip,
  VisBulletLegend,
} from "@unovis/vue";
import { BubbleChartProps } from "./types";
import { LegendPosition } from "../../types";
import { getFirstPropertyValue } from "../../utils";

import Tooltip from "../Tooltip.vue";

import type { NumericAccessor } from "@unovis/ts";

const props = withDefaults(defineProps<BubbleChartProps<T>>(), {
  hideXAxis: false,
  hideYAxis: false,
  xLabel: "",
  yLabel: "",
  xGridLine: false,
  yGridLine: true,
  xDomainLine: true,
  yDomainLine: true,
  xTickLine: true,
  yTickLine: true,
  xNumTicks: undefined,
  yNumTicks: undefined,
  xExplicitTicks: undefined,
  minMaxTicksOnly: false,
  hideLegend: false,
  legendPosition: LegendPosition.BottomCenter,
  padding: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  hideTooltip: false,
  crosshairConfig: () => ({
    color: "#666",
  }),
  legendStyle: undefined,
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

const x: NumericAccessor<T> = props.xAccessor!;
const y: NumericAccessor<T> = props.yAccessor!;
const size: NumericAccessor<T> =
  props.sizeAccessor ||
  ((d: any) => (typeof d.comments === "number" ? d.comments : 1));

const color = (d: T) => {
  if (!props.categories || !props.categoryKey) {
    console.warn(
      "BubbleChart: categories and categoryKey are required for color mapping"
    );
    return "#cccccc";
  }

  const categoryValue = String(d[props.categoryKey as keyof T]);
  let categoryColor = props.categories[categoryValue]?.color;

  if (Object.keys(props.categories).length === 1) {
    categoryColor =
      props.categories[props.categoryKey as keyof typeof props.categories]
        ?.color;
  }

  if (!categoryColor) {
    console.warn(
      `BubbleChart: No color defined for category "${categoryValue}"`
    );
    return "#cccccc";
  }

  return categoryColor;
};

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

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

const triggers = {
  [Scatter.selectors.point]: onCrosshairUpdate,
};

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
  >
    <VisXYContainer
      :data="props.data"
      :height="props.height || 600"
      :padding="props.padding"
      :scaleByDomain="true"
      @click="emit('click', $event, hoverValues)"
    >
      <VisTooltip v-if="!props.hideTooltip" :triggers="triggers" />
      <VisScatter
        :x="x"
        :y="y"
        :color="color"
        :size="size"
        :labelPosition="props.labelPosition || Position.Bottom"
        :sizeRange="props.sizeRange || [1, 20]"
        :opacity="props.opacity"
        cursor="pointer"
      />
      <VisAxis
        v-if="!props.hideXAxis"
        type="x"
        :label="props.xLabel"
        :tickFormat="props.xFormatter"
        :gridLine="props.xGridLine"
        :domainLine="!!props.xDomainLine"
        :tickLine="props.xTickLine"
        :numTicks="props.xNumTicks"
        :tickValues="props.xExplicitTicks"
        :minMaxTicksOnly="props.minMaxTicksOnly"
        v-bind="xAxisConfig"
      />
      <VisAxis
        v-if="!props.hideYAxis"
        type="y"
        :label="props.yLabel"
        :tickFormat="props.yFormatter"
        :gridLine="props.yGridLine"
        :domainLine="!!props.yDomainLine"
        :tickLine="props.yTickLine"
        :numTicks="props.yNumTicks"
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
        class="bulletLegendOverrides"
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

    <div ref="slotWrapper" class="hidden">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <Tooltip
          :data="hoverValues"
          :categories="props.categories || {}"
          :title-formatter="props.tooltipTitleFormatter"
          :yFormatter="props.yFormatter"
        />
      </slot>
    </div>
  </div>
</template>
