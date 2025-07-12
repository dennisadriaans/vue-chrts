<script lang="ts" setup>
import { LineChart, LegendPosition, BulletLegendItemInterface } from "../lib";

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


const markerConfiguration: Record<string, MarkerConfig> = {
  desktop: {
    type: 'circle',
    size: 10,
    strokeWidth: 2,
    color: '#f00'
  },
  mobile: {
    type: 'diamond',
    size: 10,
    strokeWidth: 3,
    color: 'orange'
  }
};

const categories3: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#f00' },
  mobile: { name: 'Mobile', color: '#4ade80' }
}


import { CurveType } from "@unovis/ts";

import { MarkerConfig } from "../lib/components/LineChart/types";
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-4">
      <div class="mb-8">
        <h1 class="text-4xl font-bold">Line Chart (demo)</h1>
        <p class="text-lg  text-neutral-500">
          Charts to effectively display trends and changes in data over time by
          connecting data points with lines.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 max-w-7xl mx-auto py-4">
      <Card>
        <template #header>
          <h2 class="heading-2 capitalize">Line Chart multiple lines</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <LineChart
          :data="chartData"
          :height="200"
          :y-grid-line="true"
          :y-num-ticks="4"
          y-label="Number of visits"
          :categories="categories3"
          :marker-config="markerConfiguration"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.Top"
        />
      </Card>

      <!-- <Card>
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
          :x-formatter="(tick: number): string => `${AreaChartData2[tick].hour}`"
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
          :x-formatter="(tick: number): string => `${chartData[tick].month}`"
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
          :x-formatter="(i: number): string => `${chartData[i].month}`"
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
          :x-formatter="(tick: number): string => `${chartData[tick].month}`"
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
          :x-formatter="(tick: number): string => `${chartData[tick].month}`"
        />
      </Card> -->
    </div>
  </div>
</template>
