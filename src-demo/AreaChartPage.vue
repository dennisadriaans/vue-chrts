<script lang="ts" setup>
import{ AreaChart } from "./../src/components/Area";
import { AreaStackedChart } from "./../src/components";

import { PaginationPosition } from "./../src/types";

import Card from "./elements/Card.vue";

import { CurveType } from "@unovis/ts";
import {
  AreaChartData1,
  AreaChartData2,
  AreaChartData3,
  AreaChartData4,
  categories1,
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
        <h1 class="text-4xl font-bold">Area Chart</h1>
        <p class="text-lg font-medium text-gray-500">
          Graph with lines connecting data points and shaded areas between the
          lines and the x-axis.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 max-w-7xl mx-auto py-4">
      <Card class="col-span-3">
        <template #header>
          <h2 class="heading-2">Area Chart multiple lines</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <AreaChart
          :data="AreaChartData1"
          :height="200"
          y-label="Number of visits"
          :categories="categories1"
          :x-num-ticks="14"
          :x-formatter="(item): string => {
            if(!item) {
              return '';
            }
              return item.date;
          }"
          :y-num-ticks="3"
          :curve-type="CurveType.MonotoneX"
          :pagination-position="PaginationPosition.Top"
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
          :x-formatter="(i): string => `${i?.hour}`"
          :curve-type="CurveType.Basis"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="text-xl my-2 font-bold">Area Chart Stacked</h2>
        </template>
        <AreaStackedChart :height="200" :data="AreaChartData3" :categories="categories4" />
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
          :x-formatter="(i): string => `${i?.month}`"
          :curve-type="CurveType.Natural"
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
          :x-formatter="(i): string => `${i?.month}`"
          :curve-type="CurveType.Step"
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
          :x-formatter="(i): string => `${i?.month}`"
        />
      </Card>
    </div>
  </div>
</template>
