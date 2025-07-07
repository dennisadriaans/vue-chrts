<script lang="ts" setup>
import { BarChart, BulletLegendItemInterface } from "./../lib";

import Card from "./elements/Card.vue";

import { VisitorsData, VisitorsCartegories } from "./data/VisitorsData";

import { LegendPosition, Orientation, CurveType } from "./../lib";
import { ref } from "vue";

const RevenueData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];


const chartData = ref([
  { month: 1, amount: 2500 },
  { month: 2, amount: 1500 },
  { month: 3, amount: 3000 },
  { month: 4, amount: 4000 },
  { month: 5, amount: 4500 },
  { month: 6, amount: 2800 },
  { month: 7, amount: 3500 },
  { month: 8, amount: 3800 },
  { month: 9, amount: 2000 },
  { month: 10, amount: 4200 },
  { month: 11, amount: 2200 },
  { month: 12, amount: 1800 },
])

const categories: Record<string, BulletLegendItemInterface> = {
  amount: { name: 'Monthly Spending', color: '#22c55e' },
}

const RevenueDataLong = [
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
  { date: "26/08/25", value: 30000 }, // Estimated
  { date: "18/08/25", value: 45000 }, // Estimated
  { date: "10/08/25", value: 55000 }, // Estimated
  { date: "02/08/25", value: 70000 }, // Estimated
  { date: "25/07/25", value: 40000 }, // Estimated
  { date: "17/07/25", value: 60000 }, // Estimated
  { date: "09/07/25", value: 35000 }, // Estimated
  { date: "01/07/25", value: 50000 }, // Estimated
  { date: "23/06/25", value: 65000 }, // Estimated
  { date: "15/06/25", value: 80000 }, // Estimated
  { date: "07/06/25", value: 45000 }, // Estimated
  { date: "30/05/25", value: 75000 }, // Estimated
  { date: "22/05/25", value: 55000 }, // Estimated
  { date: "14/05/25", value: 60000 }, // Estimated
  { date: "06/05/25", value: 40000 }, // Estimated
  { date: "28/04/25", value: 30000 }, // Estimated
  { date: "20/04/25", value: 50000 }, // Estimated
  { date: "12/04/25", value: 70000 }, // Estimated
  { date: "04/04/25", value: 65000 }, // Estimated
  { date: "27/03/25", value: 85000 }, // Estimated
  { date: "19/03/25", value: 55000 }, // Estimated
  { date: "11/03/25", value: 45000 }, // Estimated
  { date: "03/03/25", value: 60000 }, // Estimated
  { date: "25/02/25", value: 35000 }, // Estimated
  { date: "16/02/25", value: 50000 }, // Estimated
  { date: "08/02/25", value: 75000 }, // Estimated
  { date: "31/01/25", value: 65000 }, // Estimated
  { date: "23/01/25", value: 40000 }, // Estimated
  { date: "15/01/25", value: 55000 }, // Estimated
  { date: "07/01/25", value: 80000 }, // Estimated
  { date: "30/12/24", value: 70000 }, // Estimated
  { date: "22/12/24", value: 60000 }, // Estimated
  { date: "14/12/24", value: 45000 }, // Estimated
  { date: "06/12/24", value: 55000 }, // Estimated
].reverse();

const RevenueCategories = {
  value: { name: "value" },
};

const RevenueCategoriesMobile = {
  mobile: { name: "Mobile" },
};


const RevenueCategoriesMultple = {
  desktop: { name: "Desktop" },
  mobile: { name: "Mobile" },
};

const TrafficData = [
  {
    date: "2024-01-01",
    country: "USA",
    device: "Desktop",
    users: 576,
    unique_users: 389,
    sessions: 7,
    pages_per_session: 4.881913133722271,
    scroll_depth: 56.96127813915611,
    session_duration: 2,
  },
  {
    date: "2024-01-01",
    country: "USA",
    device: "Mobile",
    users: 748,
    unique_users: 504,
    sessions: 8,
    pages_per_session: 4.393721820350049,
    scroll_depth: 45.56902251132489,
    session_duration: 2,
  }
]

const TrafficCategories: Record<string, BulletLegendItemInterface> = {
  users: { name: "Users", color: "#016538" },
  unique_users: { name: "Unique users", color: "#403e3e" },
};

function formatDate(timestamp?: number | string) {
  if (!timestamp) return "";
  const options = {
    month: "short",
    day: "numeric",
  };

  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return `${formattedDate}`;
}

const xFormatter = (i: number): string | number => `${TrafficData[i]?.date}`;
const xFormatterDate = (i: number): string | number => formatDate(new Date(`2025-${chartData.value[i]?.month}-01`).getTime());


const formatCurrency = (tick: number | Date) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(tick))
}
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
        </template>
        <BarChart
          :data="RevenueData"
          :height="250"
          :categories="RevenueCategoriesMultple"
          :y-axis="['desktop']"
          :radius="4"
          :x-formatter="(tick: number, i: number ): string => `${tick}-${i}`"
          :y-formatter="(i: number) => `${i}`"
          :legend-position="LegendPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Horizontal</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="[...RevenueData].reverse()"
          :height="250"
          :categories="RevenueCategoriesMobile"
          :y-axis="['desktop']"
          :xNumTicks="6"
          :radius="4"
          :bar-padding="0"
          :orientation="Orientation.Horizontal"
          :y-formatter="(i: number): string => `${[...RevenueData].reverse()[i]?.month }`"
          :legend-position="LegendPosition.Top"
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
          :radius="4"
          :x-formatter="(i: number): string => `${RevenueData[i]?.month }`"
          :y-formatter="(i: number) => i"
          :legend-position="LegendPosition.Top"
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
          :x-formatter="(i: number): string => console.log(i)"
          :y-formatter="(i: number) => i"
          :legend-position="LegendPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Vertical</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="VisitorsData.slice(0, 6)"
          :height="250"
          :categories="VisitorsCartegories"
          :y-axis="['visitors']"
          :x-num-ticks="6"
          :radius="4"
          :x-formatter="(i: number): string => `${RevenueData[i]?.month }`"
          :y-formatter="(i: number) => i"
          :legend-position="LegendPosition.Top"
        />
      </Card>

      <Card>
        <template #header>
          <h2 class="heading-2">Bar Chart Stacked Horizontal</h2>
          <!-- <p class="text-gray-500">Website visitors per device</p> -->
        </template>
        <BarChart
          :data="[...RevenueData].reverse()"
          :stacked="true"
          :height="250"
          :categories="RevenueCategoriesMultple"
          :y-axis="['desktop', 'mobile']"
          :group-padding="0"
          :bar-padding="0.2"
          :xNumTicks="6"
          :radius="4"
          :orientation="Orientation.Horizontal"
          :x-formatter="(i: number): string => `${i}`"
          :y-formatter="(i: number): string => `${[...RevenueData].reverse()[i]?.month }`"
          :legend-position="LegendPosition.Top"
        />
      </Card>
    </div>

    <div class="max-w-7xl mx-auto">
      <BarChart
        :data="RevenueDataLong"
        :height="358"
        :categories="RevenueCategories"
        :y-axis="['value']"
        :hide-legend="true"
        :y-formatter="(i: number) => '123'"
        :x-formatter="(i) => '123'"
      />
    </div>

    <div class="max-w-7xl mx-auto">

      <BarChart
          :data="TrafficData"
          :height="220"
          :y-num-ticks="4"
          :group-padding="0.2"
           :y-axis="['users']"
          :categories="TrafficCategories"
          :x-formatter="xFormatter"
          :grid-line-y="true"
          :legend-position="LegendPosition.Bottom"
        />
    </div>


    <div class="max-w-7xl mx-auto">
    <BarChart
        :data="chartData"
        :height="180"
        :categories="categories"
        :y-axis="['amount']"
        :y-num-ticks="2"
        :curve-type="CurveType.Basis"
        :legend-position="LegendPosition.Top"
        :x-formatter="xFormatterDate"
        :y-formatter="formatCurrency"
      />
    </div>
  </div>
</template>
