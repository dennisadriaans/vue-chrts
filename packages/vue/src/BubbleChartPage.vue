<script lang="ts" setup>
import { BubbleChart, BulletLegendItemInterface } from "./../lib";
import Card from "./elements/Card.vue";
import { data as bubbleChartData } from "./data/BubbleChartData";

const bubbleCategories: Record<string, BulletLegendItemInterface> = {
  y: { name: "Monthly Spending", color: "#22c55e" },
};

function formatCurrency(tick: number | Date) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(tick));
}

const xFormatter = (i: number) => bubbleChartData[i]?.major ?? "";
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-4">
      <div class="mb-8 space-y-4">
        <h1 class="text-4xl font-bold">Bubble Chart</h1>
        <p class="text-lg font-medium text-gray-500">
          Bubble charts visualize three dimensions of data: X, Y, and bubble size.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <Card>
        <template #header>
          <h2 class="heading-2">Monthly Spending Bubble Chart</h2>
        </template>
        <BubbleChart
          :data="bubbleChartData"
          :height="400"
          :categories="bubbleCategories"
          :x-formatter="xFormatter"
          :y-formatter="formatCurrency"
          :legend-position="'top'"
        />
      </Card>
    </div>
  </div>
</template>
