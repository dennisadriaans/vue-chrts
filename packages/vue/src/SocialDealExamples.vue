<script setup lang="ts">
import { LegendPosition } from "./../lib/types";

import { BarChart } from "../lib";

type RevenueDataItem = {
  month: string;
  desktop: { done: number; pending: number };
  mobile: { done: number; pending: number };
  android: { done: number; pending: number };
  ios: { done: number; pending: number };
};

const RevenueData: RevenueDataItem[] = [
  {
    month: "January",
    desktop: {
      done: 25,
      pending: 25,
    },
    mobile: {
      done: 25,
      pending: 50,
    },
    android: {
      done: 25,
      pending: 50,
    },
    ios: {
      done: 0,
      pending: 25,
    },
  },
  {
    month: "February",
    desktop: {
      done: 25,
      pending: 25,
    },
    mobile: {
      done: 25,
      pending: 25,
    },
    android: {
      done: 25,
      pending: 25,
    },
    ios: {
      done: 25,
      pending: 25,
    },
  },
  {
    month: "Maart",
    desktop: {
      done: 25,
      pending: 25,
    },
    mobile: {
      done: 25,
      pending: 25,
    },
    android: {
      done: 25,
      pending: 25,
    },
    ios: {
      done: 25,
      pending: 25,
    },
  },
];

const RevenueCategoriesMultple = {
  desktopDone: { name: "Desktop Done", color: "#2B7FFF" },
  mobileDone: { name: "Mobile Done", color: "#EFB100" },
  androidDone: { name: "Android Done", color: "#00C16A" },
  iosDone: { name: "iOS Done", color: "#AD46FF" },
  desktopPending: { name: "Desktop Pending", color: "#8EC5FF" },
  mobilePending: { name: "Mobile Pending", color: "#FFDF20" },
  androidPending: { name: "Android Pending", color: "#7FE0A8" },
  iosPending: { name: "iOS Pending", color: "#D69FFF" },
};
const xFormatter = (i: number): string => `${RevenueData[i]?.month}`;
const yFormatter = (i: number) => i.toString();
</script>
<template>
  <div class="mx-auto max-w-xl sm:py-8">
    <BarChart
      :data="RevenueData"
      :height="400"
      :categories="RevenueCategoriesMultple"
      x-axis="month"
      :y-axis="['desktop', 'mobile', 'android', 'ios']"
      :radius="4"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.Top"
      :stack-and-grouped="true"
      :bar-padding="0.8"
      :stacked-grouped-spacing="0.2"
      :hide-legend="false"
      :y-grid-line="true"
    >
      <!-- <template #tooltip="values">
      {{ values }}
    </template> -->
    </BarChart>
  </div>
</template>
