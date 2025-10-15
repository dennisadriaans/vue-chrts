<script lang="ts" setup>
import { LineChart } from "../lib";

import Card from "./elements/Card.vue";

type LineChartItem = {
  month: string;
  desktop: number;
  mobile: number;
};

const chartData: LineChartItem[] = [
  { month: "January", desktop: 186, mobile: 186 },
  { month: "February", desktop: 305, mobile: 305 },
  { month: "March", desktop: 237, mobile: 237 },
  { month: "April", desktop: 260, mobile: 209 },
  { month: "May", desktop: 209, mobile: 209 },
  { month: "June", desktop: 250, mobile: 214 },
];

import { CurveType } from "@unovis/ts";
import {
  AreaChartData2,
  AreaChartData4,
  categories2,
  categories3,
  categories5,
} from "./data/AreaChartData";
import { MarkerConfig } from "../lib/types";

interface ChartConfig {
  id: number;
  title: string;
  curveType: CurveType;

  xGridLine: boolean;
  yGridLine: boolean;
  yDomainLine: boolean;
  xDomainLine: boolean;
  minMaxTicksOnly: boolean;
  hideLegend: boolean;
  markerConfig?: Record<string, MarkerConfig>;
  lineDashArray?: number[][];
}

const chartConfigs: ChartConfig[] = [
  {
    id: 0,
    title: "Area Lines",
    curveType: CurveType.MonotoneX,
    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 1,
    title: "Spline Legend",
    curveType: CurveType.Natural,

    lineDashArray: [
      [0, 0],
      [5, 5]
    ],

    xGridLine: false,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 2,
    title: "Stacked No Grid",
    curveType: CurveType.StepAfter,
    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
    markerConfig: {
      desktop: {
        type: "circle",
        size: 6,
        strokeWidth: 5,
        color: "#156F36",
      },
    },
  },
  {
    id: 3,
    title: "Custom Markers",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: false,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 4,
    title: "Hidden Legend",
    curveType: CurveType.MonotoneY,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 5,
    title: "Linear Minimal",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 6,
    title: "Stacked Legend",
    curveType: CurveType.Natural,

    xGridLine: false,
    yGridLine: true,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 7,
    title: "100% Stacked",
    curveType: CurveType.MonotoneX,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 8,
    title: "Step No Domain",
    curveType: CurveType.Step,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 9,
    title: "MonotoneY Hidden",
    curveType: CurveType.MonotoneY,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 10,
    title: "Natural Y-Grid",
    curveType: CurveType.Natural,

    xGridLine: false,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 11,
    title: "Step All Grid",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 12,
    title: "Linear Hidden Markers",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: false,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 13,
    title: "Monotone Stacked",
    curveType: CurveType.MonotoneX,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 14,
    title: "Natural Crosshair",
    curveType: CurveType.Natural,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 15,
    title: "Step Stacked 100%",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 16,
    title: "Linear No Grid",
    curveType: CurveType.Linear,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 17,
    title: "Monotone Minimal",
    curveType: CurveType.MonotoneY,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 18,
    title: "Natural Stacked",
    curveType: CurveType.Natural,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 19,
    title: "Step Hidden Markers",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 20,
    title: "Linear All Grid",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 21,
    title: "Monotone Minimal Grid",
    curveType: CurveType.MonotoneX,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 22,
    title: "Natural Stacked 100%",
    curveType: CurveType.Natural,

    xGridLine: false,
    yGridLine: true,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 23,
    title: "Step Hidden Grid",
    curveType: CurveType.Step,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 24,
    title: "Monotone No Domain",
    curveType: CurveType.MonotoneY,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 25,
    title: "Linear Stacked Hidden",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 26,
    title: "Natural Minimal Crosshair",
    curveType: CurveType.Natural,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 27,
    title: "Step Grid Markers",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 28,
    title: "Linear Stacked 100%",
    curveType: CurveType.Linear,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 29,
    title: "Monotone No Grid",
    curveType: CurveType.MonotoneX,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 30,
    title: "Natural Stacked Right",
    curveType: CurveType.Natural,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 31,
    title: "Step Minimal Hidden",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 32,
    title: "Linear Grid Markers",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 33,
    title: "Monotone Stacked 100%",
    curveType: CurveType.MonotoneX,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 34,
    title: "Natural No Grid",
    curveType: CurveType.Natural,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 35,
    title: "Step Stacked Minimal",
    curveType: CurveType.Step,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 36,
    title: "Monotone All Grid",
    curveType: CurveType.MonotoneY,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 37,
    title: "Linear Hidden Markers",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 38,
    title: "Natural Stacked 100%",
    curveType: CurveType.Natural,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 39,
    title: "Step Grid Hidden",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 40,
    title: "Linear Crosshair",
    curveType: CurveType.Linear,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 41,
    title: "Monotone Stacked Minimal",
    curveType: CurveType.MonotoneX,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 42,
    title: "Natural Grid Hidden",
    curveType: CurveType.Natural,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 43,
    title: "Step Stacked 100%",
    curveType: CurveType.Step,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 44,
    title: "Monotone No Grid",
    curveType: CurveType.MonotoneY,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 45,
    title: "Linear Stacked Markers",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 46,
    title: "Natural Minimal Hidden",
    curveType: CurveType.Natural,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 47,
    title: "Step Grid Crosshair",
    curveType: CurveType.StepAfter,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
  {
    id: 48,
    title: "Linear Stacked 100%",
    curveType: CurveType.Linear,

    xGridLine: true,
    yGridLine: false,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
    type: "stacked100",
  },
  {
    id: 49,
    title: "Natural No Grid",
    curveType: CurveType.Natural,

    xGridLine: false,
    yGridLine: false,
    yDomainLine: false,
    xDomainLine: false,
    minMaxTicksOnly: true,
    hideLegend: false,
  },
  {
    id: 50,
    title: "Step Grid Markers",
    curveType: CurveType.Step,

    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    hideLegend: false,
  },
];

function handleChartClick(_: MouseEvent, hoverValues?: LineChartItem) {
  console.log("Chart clicked", hoverValues);
}
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-screen-2xl mx-auto space-y-4">
       <div class="mb-8 text-left mt-4 space-y-2">
        <h1 class="text-3xl font-bold">Beautiful Charts</h1>
        <p class="text-lg dark:text-neutral-400 text-neutral-600">
          Awesome Vue.js charts for Nuxt or any Vue project you're working on.
        </p>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto py-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        <Card v-for="config in chartConfigs" :key="config.id">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="heading-2">{{ config.title }}</h2>
          </div>
          <LineChart
            :data="chartData"
            :height="200"
            y-label="Number of visits"
            :categories="categories3"
            :x-formatter="(tick: number): string => `${chartData[tick].month}`"
            :curve-type="config.curveType"
            :legend-position="config.legendPosition"
            :line-width="config.lineWidth"
            :line-dash-array="config.lineDashArray"
            :crosshair-config="config.crosshairConfig"
            :marker-config="config.markerConfig"
            :x-grid-line="config.xGridLine"
            :y-grid-line="config.yGridLine"
            :y-domain-line="config.yDomainLine"
            :x-domain-line="config.xDomainLine"
            :min-max-ticks-only="config.minMaxTicksOnly"
            :hide-legend="config.hideLegend"
            @click="handleChartClick"
          />
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Stroke maps to color key in categories */
/* The color should match the color defined in categories */
.markers:deep(*[stroke="#156F36"]) {
  marker: url("#circle-marker-desktop");
}
.markers:deep(*[stroke="#4ade80"]) {
  marker: url("#circle-marker-mobile");
}
</style>