<script setup lang="ts">
import { BarChart } from "../../lib";

const chartData = [
  {
    "date": "wk 40\n 29-9/5-10",
    "total": 4
  },
  {
    "date": "wk 41\n 6-10/12-10",
    "total": 0
  },
  {
    "date": "wk 42\n 13-10/19-10",
    "total": 0
  },
  {
    "date": "wk 43\n 20-10/26-10",
    "total": 0
  },
  {
    "date": "wk 44\n 27-10/2-11",
    "total": 0
  }
];

const categories: Record<string, any> = {
  total: { name: "Monthly Spending", color: "#22c55e" },
};

const formatCurrency = (tick: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tick);
};

</script>

<template>
  <BarChart
    :data="chartData"
    :height="300"
    :categories="categories"
    :x-axis="'date'"
    :y-axis="['total']"
    class="!space-y-0"

    :radius="4"
    :y-grid-line="true"
    :hide-legend="true"
  />
</template>
