<script lang="ts" setup>
import { Orientation } from "@unovis/ts";
import { BarChart } from "./../src/components";

import Card from "./elements/Card.vue";

import { VisitorsData, VisitorsCartegories } from "./data/VisitorsData";

import { PaginationPosition } from './../src/types'

const RevenueData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const RevenueCategories = {
  desktop: { name: "Desktop", color: "#00dc82" },
};

const RevenueCategoriesMultple = {
  desktop: { name: "Desktop", color: "#00dc82" },
  mobile: { name: "Mobile", color: "#156F36" },
};
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-4">
      <div class="mb-8 space-y-4">
        <h1 class="text-4xl font-bold">Bar Chart</h1>
        <p class="text-lg font-medium text-gray-500">
          Bar charts to represent data, with bar lengths proportional to the
          values they represent.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 max-w-7xl mx-auto py-4">
      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Vertical</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="RevenueData"
          :height="250"
          :categories="RevenueCategories"
          :y-axis="['desktop']"
          :xNumTicks="6"
          :radius="4"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number): string => `${RevenueData[i].month }`"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Horizontal</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="RevenueData"
          :height="250"
          :categories="RevenueCategories"
          :y-axis="['desktop']"
          :xNumTicks="6"
          :radius="4"
          :bar-padding="0"
          :orientation="Orientation.Horizontal"
          :x-formatter="() => ''"
          :y-formatter="(i: number): string => `${RevenueData[i].month }`"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Group</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="RevenueData"
          :height="250"
          :categories="RevenueCategoriesMultple"
          :y-axis="['desktop', 'mobile']"
          :group-padding="0"
          :bar-padding="0.2"
          :xNumTicks="6"
          :radius="4"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number): string => `${RevenueData[i].month }`"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Stacked</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="RevenueData"
          :stacked="true"
          :height="250"
          :categories="RevenueCategoriesMultple"
          :y-axis="['desktop', 'mobile']"
          :group-padding="0"
          :bar-padding="0.2"
          :xNumTicks="6"
          :radius="4"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number): string => `${RevenueData[i].month }`"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Vertical</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="VisitorsData.slice(0, 11)"
          :height="250"
          :categories="VisitorsCartegories"
          :y-axis="['visitors']"
          :xNumTicks="1"
          :radius="4"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number,): string => {
            const date = new Date(VisitorsData[i].date)
              return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
            }"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Stacked Horizontal</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="RevenueData"
          :stacked="true"
          :orientation="Orientation.Horizontal"
          :height="250"
          :categories="RevenueCategoriesMultple"
          :y-axis="['desktop', 'mobile']"
          :group-padding="0"
          :bar-padding="0.2"
          :xNumTicks="6"
          :radius="4"
          :x-formatter="(i: number) => i"
          :y-formatter="(i: number): string => `${RevenueData[i].month }`"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>
    </div>
  </div>
</template>
