<script lang="ts" setup>
import { BarChart, BulletLegendItemInterface } from "./../lib";
import Card from "./elements/Card.vue";
import Button from "./elements/Button.vue";
import { VisitorsData, VisitorsCartegories } from "./data/VisitorsData";
import { LegendPosition, Orientation } from "./../lib";
import { ref } from "vue";
import { BarChartProps } from "../lib/types";

import BarWithLabel from "./components/BarWithLabel.vue";
import TestDomainScale from "./components/TestDomainScale.vue";

type DataProps = {
  month?: string;
  desktop?: number;
  mobile?: number;
  date?: string;
  value?: number;
  visitors?: number;
};

// SocialDeal chart data type (flattened)
type SocialDealChartData = {
  month: string;
  desktopDone: number;
  desktopPending: number;
  mobileDone: number;
  mobilePending: number;
  androidDone: number;
  androidPending: number;
  iosDone: number;
  iosPending: number;
};

const RevenueData: DataProps[] = [
  { month: "january", desktop: 186, mobile: 80, tablet: 40 },
  { month: "february", desktop: 305, mobile: 200, tablet: 60 },
  { month: "march", desktop: 237, mobile: 120, tablet: 50 },
  { month: "april", desktop: 73, mobile: 190, tablet: 30 },
  { month: "may", desktop: 209, mobile: 130, tablet: 70 },
  { month: "jun", desktop: 214, mobile: 140, tablet: 55 },
];

const RevenueDataLong: DataProps[] = [
  { date: "16/12/25", value: 60000 },
  { date: "08/12/25", value: 40000 },
  { date: "30/11/25", value: 40000 },
  { date: "22/11/25", value: 30000 },
  { date: "14/11/25", value: 65000 },
  { date: "06/11/25", value: 90000 },
  { date: "29/10/25", value: 35000 },
  { date: "21/10/25", value: 25000 },
  { date: "13/10/25", value: 60000 },
  { date: "05/10/25", value: 55000 },
  { date: "27/09/25", value: 110000 },
  { date: "19/09/25", value: 60000 },
  { date: "11/09/25", value: 50000 },
  { date: "03/09/25", value: 80000 },
  { date: "26/08/25", value: 30000 },
  { date: "18/08/25", value: 45000 },
  { date: "10/08/25", value: 55000 },
  { date: "02/08/25", value: 70000 },
  { date: "25/07/25", value: 40000 },
  { date: "17/07/25", value: 60000 },
  { date: "09/07/25", value: 35000 },
  { date: "01/07/25", value: 50000 },
  { date: "23/06/25", value: 65000 },
  { date: "15/06/25", value: 80000 },
  { date: "07/06/25", value: 45000 },
  { date: "30/05/25", value: 75000 },
  { date: "22/05/25", value: 55000 },
  { date: "14/05/25", value: 60000 },
  { date: "06/05/25", value: 40000 },
  { date: "28/04/25", value: 30000 },
  { date: "20/04/25", value: 50000 },
  { date: "12/04/25", value: 70000 },
  { date: "04/04/25", value: 65000 },
  { date: "27/03/25", value: 85000 },
  { date: "19/03/25", value: 55000 },
  { date: "11/03/25", value: 45000 },
  { date: "03/03/25", value: 60000 },
  { date: "25/02/25", value: 35000 },
  { date: "16/02/25", value: 50000 },
  { date: "08/02/25", value: 75000 },
  { date: "31/01/25", value: 65000 },
  { date: "23/01/25", value: 40000 },
  { date: "15/01/25", value: 55000 },
  { date: "07/01/25", value: 80000 },
  { date: "30/12/24", value: 70000 },
  { date: "22/12/24", value: 60000 },
  { date: "14/12/24", value: 45000 },
  { date: "06/12/24", value: 55000 },
].reverse();

const RevenueCategories = {
  value: { name: "value", color: "#22c55e" },
};
const RevenueCategoriesMobile = {
  mobile: { name: "Mobile", color: "#156F36" },
};
const RevenueCategoriesMultiple = {
  desktop: { name: "Desktop", color: "#156F36" },
  mobile: { name: "Mobile", color: "#16a34a" },
};

type PreviewProps = { id: number; title: string; description: string };

type BarChartExample =
  | (Partial<BarChartProps<DataProps>> & PreviewProps)
  | (Partial<BarChartProps<SocialDealChartData>> & PreviewProps);

const barChartExamples: BarChartExample[] = [
  {
    id: 1,
    title: "Vertical Bar Chart (Grouped)",
    description:
      "Compare desktop and mobile revenue per month, grouped by device.",
    data: RevenueData,
    categories: RevenueCategoriesMultiple,
    valueLabel: {
      label: (d) => {
        return d.y.toString();
      },
      labelSpacing: 25,
      color: "red",
    },
    xAxis: "month",
    yAxis: ["desktop", "mobile", "tablet"],
    groupPadding: 0,
    barPadding: 0.2,
    xFormatter: (tick: number, i?: number) =>
      `${RevenueData[typeof i !== "undefined" ? i : tick]?.month}`,
    yFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? tick : tick}`,
  },
  {
    id: 8,
    title: "Stacked & Grouped Bar Chart (SocialDeal)",
    description:
      "Stacked and grouped bar chart with multiple device types and statuses.",
    data: [
      {
        month: "January",
        desktop: {
          done: 25,
          pending: 25,
          tablet: 22,
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
    ],
    categories: {
      desktopDone: { name: "Desktop Done", color: "#2B7FFF" },
      mobileDone: { name: "Mobile Done", color: "#EFB100" },
      androidDone: { name: "Android Done", color: "#00C16A" },
      iosDone: { name: "iOS Done", color: "#AD46FF" },
      desktopPending: { name: "Desktop Pending", color: "#8EC5FF" },
      mobilePending: { name: "Mobile Pending", color: "#FFDF20" },
      androidPending: { name: "Android Pending", color: "#7FE0A8" },
      iosPending: { name: "iOS Pending", color: "#D69FFF" },
    },
    xAxis: "month",
    yAxis: ["desktopDone", "mobileDone", "androidDone", "iosDone"],
    stackAndGrouped: true,
    radius: 4,
    xFormatter: (tick: number, i?: number) => {
      const months = ["January", "February", "Maart"];
      return months[typeof i !== "undefined" ? i : tick] || String(tick);
    },
    yFormatter: (tick: number, i?: number) => String(tick),
    legendPosition: LegendPosition.Top,
    barPadding: 0.8,
    stackedGroupedSpacing: 0.25,
    hideLegend: false,
    yGridLine: true,
  },
  {
    id: 2,
    title: "Vertical Bar Chart (Single Series)",
    description: "Show only desktop revenue per month.",
    data: RevenueData,
    categories: RevenueCategoriesMultiple,
    yAxis: ["desktop"],
    orientation: undefined,
    stacked: false,
    groupPadding: undefined,
    barPadding: undefined,
    xFormatter: (tick: number, i?: number) =>
      `${tick}${typeof i !== "undefined" ? "-" + i : ""}`,
    yFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? i : tick}`,
  },
  {
    id: 3,
    title: "Horizontal Bar Chart (Single Series)",
    description: "Show mobile revenue per month, horizontal orientation.",
    data: [...RevenueData].reverse(),
    categories: RevenueCategoriesMobile,
    yAxis: ["desktop"],
    orientation: Orientation.Horizontal,
    stacked: false,
    groupPadding: undefined,
    barPadding: 0,
    xNumTicks: 6,
    xFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? i : tick}`,
    yFormatter: (tick: number, i?: number) =>
      `${
        [...RevenueData].reverse()[typeof i !== "undefined" ? i : tick]?.month
      }`,
  },
  {
    id: 4,
    title: "Stacked Bar Chart (Vertical)",
    description: "Stack desktop and mobile revenue for each month.",
    data: RevenueData,
    categories: RevenueCategoriesMultiple,
    yAxis: ["desktop", "mobile"],
    orientation: undefined,
    stacked: true,
    groupPadding: 0,
    barPadding: 0.2,
    xNumTicks: 6,
    xFormatter: (tick: number, i?: number) =>
      `${RevenueData[typeof i !== "undefined" ? i : tick]?.month}`,
    yFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? i : tick}`,
  },
  {
    id: 5,
    title: "Stacked Bar Chart (Horizontal)",
    description:
      "Stack desktop and mobile revenue for each month, horizontal orientation.",
    data: [...RevenueData].reverse(),
    categories: RevenueCategoriesMultiple,
    yAxis: ["desktop", "mobile"],
    orientation: Orientation.Horizontal,
    stacked: true,
    groupPadding: 0,
    barPadding: 0.2,
    xNumTicks: 6,
    xFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? i : tick}`,
    yFormatter: (tick: number, i?: number) =>
      `${
        [...RevenueData].reverse()[typeof i !== "undefined" ? i : tick]?.month
      }`,
  },
  {
    id: 6,
    title: "Long Data Bar Chart",
    description: "Show a long time series of revenue data.",
    data: RevenueDataLong,
    categories: RevenueCategories,
    yAxis: ["value"],
    orientation: undefined,
    stacked: false,
    groupPadding: undefined,
    barPadding: undefined,
    xFormatter: (tick: number, i?: number) =>
      `${RevenueDataLong[typeof i !== "undefined" ? i : tick]?.date}`,
    yFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? i : tick}`,
  },
  {
    id: 7,
    title: "Visitors Bar Chart",
    description: "Show visitors data for the first 6 months.",
    data: VisitorsData.slice(0, 6),
    categories: VisitorsCartegories,
    yAxis: ["visitors"],
    orientation: undefined,
    stacked: false,
    groupPadding: undefined,
    barPadding: undefined,
    legendPosition: 'bottom',
    xNumTicks: 6,
    xFormatter: (tick: number, i?: number) =>
      `${RevenueData[typeof i !== "undefined" ? i : tick]?.month}`,
    yFormatter: (tick: number, i?: number) =>
      `${typeof i !== "undefined" ? i : tick}`,
  },
];

function handleChartClick(event: MouseEvent, hoverValues: any) {
  console.log("BarChart clicked", hoverValues);
}
</script>

<template>
  <div class="space-y-12 pb-24 pt-8 max-w-screen-2xl mx-auto">
    <div class="mb-8 text-left mt-4 space-y-2">
      <h1 class="text-3xl font-bold">Bar Chart Examples</h1>
      <p class="text-lg dark:text-neutral-400 text-neutral-600">
        Explore different Bar Chart configurations for your V
      </p>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 items-stretch"
      >
        <Card
          v-for="(example, exampleKey) in barChartExamples"
          :key="exampleKey"
        >
          <div class="flex items-center justify-between">
            <h2 class="heading-2">{{ example.title }}</h2>
            <Button
              color="white"
              class="!bg-neutral-900"
              icon="i-heroicons:arrow-right-20-solid"
              :trailing="true"
              type="outline"
              size="sm"
            >
              View code
            </Button>
          </div>
          <p class="mb-2 text-sm text-neutral-500">{{ example.description }}</p>
          <BarChart v-bind="example" :height="200" @click="handleChartClick" />
        </Card>
      </div>
    </div>
  </div>
</template>
