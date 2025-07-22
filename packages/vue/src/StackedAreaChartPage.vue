<script lang="ts" setup>
import Card from "./elements/Card.vue";
import {AreaChart , CurveType, LegendPosition  } from "../lib";

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
        123
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
          :curve-type="CurveType.Step"
          :legend-position="LegendPosition.Top"
        />
      </Card>

    </div>
  </div>
</template>
