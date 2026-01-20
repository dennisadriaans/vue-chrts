<script lang="ts" setup>
import { DualChart, LegendPosition, CurveType } from "./../lib";
import Card from "./elements/Card.vue";
import Button from "./elements/Button.vue";
import {
  DualChartData,
  DualChartBarCategories,
  DualChartLineCategories,
  SalesTargetData,
  SalesTargetBarCategories,
  SalesTargetLineCategories,
  type DualChartDataItem,
  type SalesTargetDataItem,
} from "./data/DualChartData";

function handleChartClick(event: MouseEvent, hoverValues: any) {
  console.log("DualChart clicked", hoverValues);
}
</script>

<template>
  <div class="space-y-12 pb-24 pt-8 max-w-screen-2xl mx-auto">
    <div class="mb-8 text-left mt-4 space-y-2">
      <h1 class="text-3xl font-bold">Dual Chart Examples</h1>
      <p class="text-lg dark:text-neutral-400 text-neutral-600">
        Combine bar and line charts to display multiple data series with different visualizations
      </p>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <!-- Example 1: Revenue, Costs & Profit -->
        <Card>
          <div class="flex items-center justify-between">
            <h2 class="heading-2">Revenue & Costs with Profit Line</h2>
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
          <p class="mb-2 text-sm text-neutral-500">
            Monthly revenue and costs shown as bars, with profit margin as a line
          </p>
          <DualChart
            :data="DualChartData"
            :bar-categories="DualChartBarCategories"
            :line-categories="DualChartLineCategories"
            :bar-y-axis="['revenue', 'costs']"
            :line-y-axis="['profit']"
            :height="300"
            :x-formatter="(tick: number): string => DualChartData[tick]?.month || ''"
            :tooltip-title-formatter="(data: DualChartDataItem) => data.month"
            :legend-position="LegendPosition.TopRight"
            y-label="Amount ($)"
            @click="handleChartClick"
          />
        </Card>

        <!-- Example 2: Sales vs Target -->
        <Card>
          <div class="flex items-center justify-between">
            <h2 class="heading-2">Sales Performance vs Target</h2>
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
          <p class="mb-2 text-sm text-neutral-500">
            Quarterly sales as bars compared to target line
          </p>
          <DualChart
            :data="SalesTargetData"
            :bar-categories="SalesTargetBarCategories"
            :line-categories="SalesTargetLineCategories"
            :bar-y-axis="['sales']"
            :line-y-axis="['target']"
            :height="300"
            :x-formatter="(tick: number): string => SalesTargetData[tick]?.quarter || ''"
            :tooltip-title-formatter="(data: SalesTargetDataItem) => data.quarter"
            :legend-position="LegendPosition.BottomCenter"
            y-label="Sales ($)"
            @click="handleChartClick"
          />
        </Card>

        <!-- Example 3: Stacked Bars with Line -->
        <Card>
          <div class="flex items-center justify-between">
            <h2 class="heading-2">Stacked Revenue & Costs with Profit</h2>
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
          <p class="mb-2 text-sm text-neutral-500">
            Stacked bars showing total composition with profit trend line
          </p>
          <DualChart
            :data="DualChartData"
            :bar-categories="DualChartBarCategories"
            :line-categories="DualChartLineCategories"
            :bar-y-axis="['revenue', 'costs']"
            :line-y-axis="['profit']"
            :height="300"
            :stacked="true"
            :x-formatter="(tick: number): string => DualChartData[tick]?.month || ''"
            :tooltip-title-formatter="(data: DualChartDataItem) => data.month"
            :legend-position="LegendPosition.TopRight"
            y-label="Amount ($)"
            @click="handleChartClick"
          />
        </Card>

        <!-- Example 4: Single Bar with Multiple Lines -->
        <Card>
          <div class="flex items-center justify-between">
            <h2 class="heading-2">Revenue with Cost & Profit Lines</h2>
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
          <p class="mb-2 text-sm text-neutral-500">
            Single bar series with multiple trend lines
          </p>
          <DualChart
            :data="DualChartData"
            :bar-categories="{ revenue: DualChartBarCategories.revenue }"
            :line-categories="{ 
              costs: DualChartBarCategories.costs, 
              profit: DualChartLineCategories.profit 
            }"
            :bar-y-axis="['revenue']"
            :line-y-axis="['costs', 'profit']"
            :height="300"
            :x-formatter="(tick: number): string => DualChartData[tick]?.month || ''"
            :tooltip-title-formatter="(data: DualChartDataItem) => data.month"
            :curve-type="CurveType.MonotoneX"
            :line-width="2"
            y-label="Amount ($)"
            @click="handleChartClick"
          />
        </Card>
      </div>
    </div>
  </div>
</template>
