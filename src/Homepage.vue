<script lang="ts" setup>
import TopBar from "./elements/TopBar.vue";
import Logo from "./elements/Logo.vue";

import { Status as BaseStatus } from "./components/Status";
import { Progress as BaseProgress } from "./components/Progress";

import {
  LineChart as BaseLine,
  BarChart as BaseBar,
  AreaChart as BaseArea,
  DonutChart as BaseDonut,
  LegendPosition,
} from "../lib";

import Button from "./elements/Button.vue";
import Card from "./elements/Card.vue";
import Table from "./elements/Table.vue";

import { h } from "vue";
import { CurveType } from "@unovis/ts";
import { InvestmentData, categories } from "./data/InvestmentData";

import {
  RevenueData,
  RevenueDataSmall,
  categories as RevenueCategories,
} from "./data/RevenueData";

const loggedIn = false;

const DonutData = [
  {
    color: "#60A5FA",
    name: "Blue",
    value: 50,
  },
  {
    color: "#CBD5E1",
    name: "Gray",
    value: 20,
  },
  {
    color: "#00DC82",
    name: "Green",
    value: 30,
  },
];

const columns = [
  {
    accessorKey: "name",
    header: "name",
    cell: ({ row }: any) => {
      return h(
        "div",
        {
          class: "flex items-center gap-4",
        },
        [
          h(
            "span",
            {
              style: {
                width: "0.75rem",
                height: "0.75rem",
                backgroundColor: row.original.color,
                display: "block",
              },
            },
            ""
          ),
          h("span", {}, `${row.getValue("name")}`),
        ]
      );
    },
  },
  {
    accessorKey: "value",
    header: "value",
    cell: ({ row }: any) => `${row.getValue("value")}`,
  },
];
</script>
<template>
  <TopBar></TopBar>
  <div class="max-w-7xl mx-auto py-4">
    <header class="py-24 sm:py-24 relative px-4 lg:px-0">
      <div class="flex items-center justify-center mb-4">
        <Logo />
      </div>
      <h1
        class="text-6xl font-bold tracking-tight text-gray-900 dark:text-white text-center max-w-3xl mx-auto"
      >
        Vue components to build charts and dashboards
      </h1>
      <p
        class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-400 text-center max-w-xl mx-auto"
      >
        Powerful & Accessible Vue Components for Dashboards & Charts. Built with
        Tailwind CSS and Nuxt UI.
      </p>
      <div class="flex items-center gap-4 mt-8 justify-center">
        <RouterLink v-if="!loggedIn" to="/auth/login">
          <Button
            color="primary"
            icon="i-heroicons:arrow-right-20-solid"
            :trailing="true"
            size="lg"
          >
            Sign in
          </Button>
        </RouterLink>
        <RouterLink v-else to="/dashboard">
          <Button
            icon="i-heroicons:arrow-right-20-solid"
            :trailing="true"
            size="lg"
          >
            Dashboard
          </Button>
        </RouterLink>
        <RouterLink to="/overview">
          <Button icon="i-heroicons:swatch" size="lg"> Overview </Button>
        </RouterLink>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-8 mb-8">
      <div class="col-span-8">
        <Card>
          <template #header>
            <h2 class="heading-2">Multi line chart</h2>
            <p class="text-gray-500">Website visitors per device</p>
          </template>
          <BaseLine
            :data="InvestmentData"
            :height="322"
            :categories="categories"
            :y-num-ticks="8"
            :x-formatter="(i: number): string => `${InvestmentData[i].date}`"
            :curve-type="CurveType.MonotoneX"
          />
        </Card>
      </div>

      <div class="col-span-4">
        <Card>
          <template #header>
            <h2 class="heading-2">Donut Chart Example</h2>
            <p class="text-gray-500">Color Distribution</p>
          </template>
          <BaseDonut
            :data="DonutData.map((i) => i.value)"
            :height="200"
            :labels="DonutData"
            :hide-pagination="true"
            :radius="0"
          >
            <div class="absolute text-center">
              <div class="font-semibold dark:text-white">Label</div>
              <div class="text-gray-500">2 seconds ago</div>
            </div>
          </BaseDonut>
          <div class="mt-4 p-0">
            <Table
              :data="DonutData"
              :columns="columns"
              :enable-sorting="false"
              :enable-pagination="false"
              :enable-filtering="false"
              :enable-row-selection="true"
              :table-size="'md'"
              :striped="true"
              :hover="true"
              :bordered="false"
              :legend-position="'bottom'"
              :page-size-options="[5, 10, 20, 50]"
              :initial-page-size="10"
            >
            </Table>
          </div>
        </Card>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8 mb-8">
      <div class="col-span-5">
        <Card class="h-full">
          <Card>
            <div class="space-y-2 mb-4">
              <p class="text-gray-500 mb-1">NuxtLabs</p>
              <div class="flex items-center justify-between">
                <h2 class="text-xl dark:text-white font-bold">$75.1K</h2>
                <div class="flex items-center gap-2 text-sm">
                  <div>+$1.1K</div>
                  <div class="text-gray-500">+9.1%</div>
                </div>
              </div>
            </div>

            <BaseArea
              :data="RevenueDataSmall"
              :height="50"
              :categories="RevenueCategories"
              :y-axis="['value']"
              :hide-legend="true"
              :hide-tooltip="true"
              :y-formatter="() => ''"
              :x-formatter="() => ''"
            />

            <template #footer>
              <div class="flex justify-end text-sm items-center gap-2">
                <span>View more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </template>
          </Card>
        </Card>
      </div>
      <div class="col-span-7">
        <Card class="h-full">
          <BaseStatus></BaseStatus>

          <template #footer>
            <h2 class="heading-2">Advanced visualizations</h2>
            <p class="text-gray-500">
              Tracker, Bar Lists, and many more components to visualize complex
              use cases gracefully.
            </p>
          </template>
        </Card>
      </div>
    </div>

    <Card>
      <div class="grid grid-cols-12 gap-4 mb-8">
        <div class="col-span-4 space-y-4">
          <Card>
            <BaseProgress
              color="#05DF72"
              label="Storage used"
              value="1.85GB"
              :total="10"
              :progress="1.85"
              unit="GB"
            ></BaseProgress>
          </Card>
          <Card>
            <BaseProgress
              color="#05DF72"
              label="Weekly active users"
              value="250"
              :total="512"
              :progress="250"
            ></BaseProgress>
          </Card>
          <Card>
            <BaseProgress
              color="#05DF72"
              label="Current costs"
              value="$293.5"
              :total="300"
              :progress="293.5"
            ></BaseProgress>
          </Card>
        </div>
        <div class="col-span-8">
          <Card>
            <template #header>
              <h2 class="heading-2">Beautiful Bar Chart</h2>
              <p class="text-gray-500">
                Tracker, Bar Lists, and many more components to visualize
                complex use cases gracefully.
              </p>
            </template>

            <BaseBar
              :data="RevenueData"
              :height="306"
              :categories="RevenueCategories"
              :y-axis="['value']"
              :hide-legend="true"
              :y-formatter="(i: number) => i"
              :x-formatter="(i: number): string => {
              return `${RevenueData[i].date }`;
            }"
              :x-num-ticks="12"
            />
          </Card>
        </div>
      </div>
    </Card>
  </div>
</template>
