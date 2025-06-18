<script setup lang="ts" generic="T extends BubbleDataItem">
import { computed, ComputedRef, createApp } from "vue";
import { Scale, ContinuousScale } from "@unovis/ts";

import {
  VisAxis,
  VisBulletLegend,
  VisScatter,
  VisTooltip,
  VisXYContainer,
  VisSingleContainer, // For title
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue"; // Assuming a generic Tooltip, may need to adapt
import { LegendPosition } from "../../types"; // General type, might not be directly used here
import { BubbleChartProps, BubbleDataItem, AxisOptions as BubbleAxisOptions, LabelOptions as BubbleLabelOptions, SizeOptions as BubbleSizeOptions, ColorOptions as BubbleColorOptions } from "./types";

const props = withDefaults(defineProps<BubbleChartProps>(), {
  width: 500,
  height: 400,
  xAxisOptions: () => ({ show: true, label: 'X Axis', gridlines: true }),
  yAxisOptions: () => ({ show: true, label: 'Y Axis', gridlines: true }),
  labelOptions: () => ({ show: true, fontSize: 10, color: '#333' }),
  sizeOptions: () => ({ minRadius: 3, maxRadius: 25 }),
  colorOptions: () => '#60A5FA', // Default single color
  showLegend: false,
  chartTitle: '',
  customClass: '',
});

// --- Data Accessors ---
const x = (d: BubbleDataItem) => d.xValue;
const y = (d: BubbleDataItem) => d.yValue;
const size = (d: BubbleDataItem) => d.sizeValue;

// --- Color Logic ---
const pointColor = computed(() => {
  return (d: BubbleDataItem, i: number) => {
    if (typeof props.colorOptions === 'string') {
      return props.colorOptions;
    }
    if (Array.isArray(props.colorOptions)) {
      return props.colorOptions[i % props.colorOptions.length];
    }
    if (typeof props.colorOptions === 'object') {
      if (d.category && props.colorOptions[d.category]) {
        return props.colorOptions[d.category];
      }
      if (d.color) return d.color;
    }
    return '#60A5FA'; // Fallback color
  };
});

// --- Size Range ---
const sizeRange = computed(() => {
  const { minRadius = 3, maxRadius = 25 } = props.sizeOptions || {};
  return [minRadius, maxRadius] as [number, number];
});

// --- Legend Items (simplified for categories or color array) ---
const legendItems = computed(() => {
  if (!props.showLegend || !props.data) return [];
  const items: { name: string, color: string }[] = [];
  const addedCategories = new Set<string>();

  if (typeof props.colorOptions === 'object' && !Array.isArray(props.colorOptions)) {
    for (const category in props.colorOptions) {
      items.push({ name: category, color: props.colorOptions[category] });
      addedCategories.add(category);
    }
  } else if (Array.isArray(props.colorOptions)) {
     // Simplified: assumes data items might have a category or label corresponding to color array
     // This part might need more robust logic based on how color array is intended to map to legend
    props.data.forEach((d, i) => {
      const label = d.category || d.label || `Item ${i+1}`;
      if (!addedCategories.has(label)) {
        items.push({ name: label, color: props.colorOptions![i % props.colorOptions!.length] });
        addedCategories.add(label);
      }
    });
  }
  // If single color, maybe one legend item for the whole series
  else if (typeof props.colorOptions === 'string' && props.data.length > 0) {
     items.push({ name: props.chartTitle || 'Data', color: props.colorOptions});
  }
  return items.filter((item, index, self) => index === self.findIndex(t => t.name === item.name));
});

// --- Tooltip ---
const tooltipComponent = computed(() => {
  // This is a placeholder. The actual Tooltip.vue might need to be made more generic
  // or a new one created for bubble charts if the structure is very different.
  // For now, let's try to pass data that might be relevant.
  return Tooltip; // Assuming Tooltip.vue can handle various data structures or can be adapted
});

const generateTooltipContent = (d: BubbleDataItem) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return "";
  // Customize this part heavily based on what Tooltip.vue expects
  // or create a specific tooltip rendering logic here.
  let html = `<strong>${d.label || d.id}</strong><br/>`;
  html += `X: ${d.xValue}<br/>`;
  html += `Y: ${d.yValue}<br/>`;
  html += `Size: ${d.sizeValue}`;
  if (d.category) {
    html += `<br/>Category: ${d.category}`;
  }
  return html;
};


// --- Axis Ticks and Formatting (using props) ---
const xTickFormat = computed(() => props.xAxisOptions?.tickFormat);
const yTickFormat = computed(() => props.yAxisOptions?.tickFormat);
const xNumTicks = computed(() => props.xAxisOptions?.numTicks);
const yNumTicks = computed(() => props.yAxisOptions?.numTicks);


</script>

<template>
  <div :class="['unovis-vue-bubble-chart-container', customClass]">
    <VisSingleContainer v-if="chartTitle" :height="30">
        <div style="text-align: center; width: 100%; font-size: 1.1em;">{{ chartTitle }}</div>
    </VisSingleContainer>
    <VisXYContainer :data="data" :width="width" :height="height" :padding="{ top: 10, right: 20, bottom: xAxisOptions.show ? 40 : 20, left: yAxisOptions.show ? 50 : 20 }">
      <VisScatter
        :x="x"
        :y="y"
        :size="size"
        :color="pointColor"
        :sizeRange="sizeRange"
        :label="props.labelOptions.show ? (d: BubbleDataItem) => d.label || d.id : undefined"
        :labelColor="props.labelOptions.color"
        :labelSize="props.labelOptions.fontSize"
        :cursor="'pointer'"
      />

      <VisTooltip :html="generateTooltipContent" :triggers="{ [VisScatter.selectors.point]: generateTooltipContent }" />

      <VisAxis
        v-if="xAxisOptions.show"
        type="x"
        :label="xAxisOptions.label"
        :gridLine="xAxisOptions.gridlines"
        :tickFormat="xTickFormat"
        :numTicks="xNumTicks"
      />
      <VisAxis
        v-if="yAxisOptions.show"
        type="y"
        :label="yAxisOptions.label"
        :gridLine="yAxisOptions.gridlines"
        :tickFormat="yTickFormat"
        :numTicks="yNumTicks"
      />
    </VisXYContainer>
    <div
      v-if="showLegend && legendItems.length"
      class="unovis-vue-legend-container"
      style="display: flex; justify-content: center; flex-wrap: wrap; margin-top: 10px;"
    >
      <VisBulletLegend :items="legendItems" />
    </div>
  </div>
</template>

<style scoped>
.unovis-vue-bubble-chart-container {
  font-family: sans-serif;
}
/* Add any specific styling for bubble chart labels if needed */
/* For example, if VisScatter label prop renders text elements */
:deep(.unovis-scatter-label) {
  /* fill: black; */ /* Handled by labelColor prop */
  /* font-size: 10px; */ /* Handled by labelSize prop */
  pointer-events: none;
  text-anchor: middle;
  dominant-baseline: central;
}
</style>
