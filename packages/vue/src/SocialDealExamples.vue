<script setup lang="ts">
import { LegendPosition } from "./../lib/types";

import { BarChart } from "../lib";
import { dynamicFlattenData, generateDataSeries } from "./utils";

type RevenueDataItem = {
  month: string;
  desktop: number;
  mobile: number;
};

const RevenueData: RevenueDataItem[] = [
  {
    month: "January",
    desktop: {
      done: 75,
      pending: 25,
    },
    mobile: {
      done: 80,
      pending: 20,
    },
    android: {
      done: 80,
      pending: 20,
    },
    ios: {
      done: 80,
      pending: 20,
    },
  },
  {
    month: "February",
    desktop: {
      done: 305,
      pending: 200,
    },
    mobile: {
      done: 200,
      pending: 100,
    },
    android: {
      done: 80,
      pending: 20,
    },
    ios: {
      done: 80,
      pending: 20,
    },
  },
  {
    month: "March",
    desktop: {
      done: 237,
      pending: 120,
    },
    mobile: {
      done: 120,
      pending: 80,
    },
    android: {
      done: 80,
      pending: 20,
    },
    ios: {
      done: 80,
      pending: 20,
    },
  },
  {
    month: "April",
    desktop: {
      done: 73,
      pending: 190,
    },
    mobile: {
      done: 190,
      pending: 50,
    },
    android: {
      done: 80,
      pending: 20,
    },
    ios: {
      done: 80,
      pending: 20,
    },
  },
  {
    month: "May",
    desktop: {
      done: 209,
      pending: 130,
    },
    mobile: {
      done: 130,
      pending: 70,
    },
    android: {
      done: 80,
      pending: 20,
    },
    ios: {
      done: 80,
      pending: 20,
    },
  },
  {
    month: "June",
    desktop: {
      done: 214,
      pending: 211,
    },
    mobile: {
      done: 140,
      pending: 60,
    },
    android: {
      done: 80,
      pending: 20,
    },
    ios: {
      done: 80,
      pending: 20,
    },
  },
];

const RevenueCategoriesMultple = {
  desktop: { name: "Desktop", color: "#3b82f6" },
  mobile: { name: "Mobile", color: "#22c55e" },
  android: { name: "Android", color: "#4caf50" },
  ios: { name: "iOS", color: "#f44336" },
};
const xFormatter = (i: number): string => `${RevenueData[i]?.month}`;
const yFormatter = (i: number) => i;
</script>
<template>
  <div class="mx-auto max-w-xl sm:py-8">
    <BarChart
      :data="RevenueData"
      :height="400"
      :categories="RevenueCategoriesMultple"
      :y-axis="['desktop', 'mobile']"
      :group-padding="0.3"
      :bar-padding="0.3"
      :xNumTicks="6"
      :radius="4"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.Top"
      :stack-and-grouped="true"
      :hide-legend="false"
      :y-grid-line="true"
    />
  </div>
</template>
