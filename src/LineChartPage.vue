<script lang="ts" setup>
import { LineChart, LegendPosition } from "../lib";

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
  AreaChartData1,
  AreaChartData2,
  AreaChartData3,
  AreaChartData4,
  AreaChartItem2,
  AreaChartItem4,
  categories2,
  categories3,
  categories4,
  categories5,
} from "./data/AreaChartData";
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-4">
      <div class="mb-8 space-y-4">
        <h1 class="text-4xl font-bold">Line Chart</h1>
        <p class="text-lg font-medium text-gray-500">
          Charts to effectively display trends and changes in data over time by
          connecting data points with lines.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 max-w-7xl mx-auto py-4">
      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart multiple lines</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <LineChart
          :data="chartData"
          :height="200"
          y-label="Number of visits"
          :categories="categories3"
          :x-formatter="(i: number): string|number => `${chartData[i].month}`"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart with single line</h2>
        </template>
        <LineChart
          :data="AreaChartData2"
          :height="200"
          x-label="Time"
          y-label="Temperature"
          :x-num-ticks="4"
          :y-num-ticks="4"
          :categories="categories2"
          :x-formatter="(i: number): string|number => `${AreaChartData2[i].hour}`"
          :curve-type="CurveType.Basis"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart multiple steps</h2>
        </template>
        <LineChart
          :data="chartData"
          :height="200"
          y-label="Number of visits"
          :categories="categories3"
          :x-formatter="(i: number): string|number => `${chartData[i].month}`"
          :curve-type="CurveType.Step"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart natrual</h2>
        </template>
        <LineChart
          :data="AreaChartData4"
          :height="200"
          x-label="Month"
          y-label="Score"
          :categories="categories5"
          :x-num-ticks="7"
          :x-formatter="(i: number): string|number => `${chartData[i].month}`"
          :curve-type="CurveType.Natural"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart step</h2>
        </template>
        <LineChart
          :data="AreaChartData4"
          :height="200"
          x-label="Month"
          y-label="Score"
          :categories="categories5"
          :y-num-ticks="4"
          :x-formatter="(i: number): string|number => `${chartData[i].month}`"
          :curve-type="CurveType.Step"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart Default</h2>
        </template>
        <LineChart
          :data="chartData"
          :height="200"
          x-label="Month"
          y-label="Score"
          :categories="categories5"
          :x-formatter="(i: number): string|number => `${chartData[i].month}`"
        />
      </Card>
    </div>
  </div>
</template>
