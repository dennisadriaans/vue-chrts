<script lang="ts" setup>
import Card from "./elements/Card.vue";

import { AreaChart, AreaStackedChart } from "./../lib";
import { CurveType, LegendPosition } from "./../lib/types";

import {
  AreaChartData1,
  AreaChartData2,
  AreaChartData3,
  AreaChartData4,
  categories1,
  categories2,
  categories4,
  categories5,
} from "./data/AreaChartData";

function handleChartClick(event: MouseEvent, hoverValues: any) {
  console.log("AreaChart clicked", hoverValues);
}
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-4">
      <div class="mb-8 space-y-4">
        <h1 class="text-4xl font-bold">Area Chart</h1>
        <p class="text-lg font-medium text-gray-500">
          Graph with lines connecting data points and shaded areas between the
          lines and the x-axis.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 max-w-7xl mx-auto py-4">
      <Card>
        <template #header>
          <h2 class="heading-2">Area Chart multiple lines</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <AreaChart
          :data="AreaChartData1"
          :height="200"
          y-label="Number of visits"
          :categories="categories1"
          :x-num-ticks="3"
          :x-formatter="(i: number) => AreaChartData1[i].date"
          :y-num-ticks="3"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.Top"
<<<<<<< HEAD
          :marker-config="{
            desktop: {
              type: 'circle',
              size: 50,
              strokeWidth: 2,
              color: '#f00',
            },
            mobile: {
              type: 'diamond',
              size: 10,
              strokeWidth: 3,
              color: 'black',
            },
          }"
=======
          @click="handleChartClick"
>>>>>>> feature/click-events
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="text-xl my-2 font-bold">Area Chart with single line</h2>
        </template>
        <AreaChart
          :data="AreaChartData2"
          :height="200"
          x-label="Time"
          y-label="Temperature"
          :categories="categories2"
          :y-num-ticks="4"
          :x-num-ticks="7"
          :x-formatter="(i: number) => AreaChartData2[i].hour"
          :curve-type="CurveType.Basis"
          @click="handleChartClick"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="text-xl my-2 font-bold">Area Chart Natrual</h2>
        </template>
        <AreaChart
          :data="AreaChartData4"
          :height="200"
          x-label="Month"
          y-label="Score"
          :categories="categories5"
          :y-num-ticks="4"
          :x-num-ticks="7"
          :x-formatter="(i: number) => AreaChartData4[i].month"
          :curve-type="CurveType.Natural"
          @click="handleChartClick"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="text-xl my-2 font-bold">Area Chart Step</h2>
        </template>
        <AreaChart
          :data="AreaChartData4"
          :height="200"
          x-label="Month"
          y-label="Score"
          :categories="categories5"
          :y-num-ticks="4"
          :x-num-ticks="7"
          :x-formatter="(i: number) => AreaChartData4[i].month"
          :curve-type="CurveType.Step"
          @click="handleChartClick"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="text-xl my-2 font-bold">Area Chart Default</h2>
        </template>
        <AreaChart
          :data="AreaChartData4"
          :height="200"
          x-label="Month"
          y-label="Score"
          :categories="categories5"
          :y-num-ticks="4"
          :x-num-ticks="7"
          :x-formatter="(i: number) => AreaChartData4[i].month"
          @click="handleChartClick"
        />
      </Card>
    </div>
  </div>
</template>
