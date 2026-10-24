<script setup lang="ts">
import { climate, monthly } from "../data";
import type { BulletLegendItemInterface, YAxisConfig } from "../../src/runtime/types/shared";

const climateCategories: Record<string, BulletLegendItemInterface> = {
  indoor: { name: "Indoor", color: "#2662d9", yAxis: "temp" },
  outdoor: { name: "Outdoor", color: "#e23670", yAxis: "temp" },
  setpoint: { name: "Setpoint", color: "#2eb88a", yAxis: "temp" },
  humidity: { name: "Humidity", color: "#af57db", yAxis: "pct" },
};

const climateAxes: Record<string, YAxisConfig> = {
  temp: { orientation: "left", label: "°C" },
  pct: { orientation: "right", label: "%", domain: [0, 100] },
};

const revenueCategories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670", yAxis: "right" },
};

const revenueAxes: Record<string, YAxisConfig> = {
  right: { orientation: "right" },
};

const sales = [
  { month: "Jan", revenue: 42000, conversion: 2.1 },
  { month: "Feb", revenue: 51000, conversion: 2.6 },
  { month: "Mar", revenue: 47000, conversion: 3.4 },
  { month: "Apr", revenue: 63000, conversion: 2.9 },
  { month: "May", revenue: 58000, conversion: 3.8 },
  { month: "Jun", revenue: 71000, conversion: 4.2 },
];

const salesCategories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: "Revenue", color: "#2662d9" },
  conversion: { name: "Conversion", color: "#e23670", yAxis: "pct", type: "line" },
};

const salesAxes: Record<string, YAxisConfig> = {
  0: { label: "Revenue", formatter: (v) => `€${Number(v) / 1000}k` },
  pct: { orientation: "right", label: "Conversion", domain: [0, 5], formatter: (v) => `${v}%` },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Multiple y-axes</h1>

    <h2>Three temperatures on one axis, humidity on its own</h2>
    <LineChart
      :data="climate"
      :categories="climateCategories"
      :y-axes="climateAxes"
      :height="320"
      x-axis="time"
    />

    <h2>Bar chart, second series on the right axis</h2>
    <BarChart
      :data="monthly"
      :categories="revenueCategories"
      :y-axes="revenueAxes"
      :y-axis="['desktop', 'mobile']"
      :height="320"
      x-axis="month"
    />

    <h2>Revenue bars (€) with a conversion line (%) on the right axis</h2>
    <BarChart
      :data="sales"
      :categories="salesCategories"
      :y-axes="salesAxes"
      :y-axis="['revenue', 'conversion']"
      :height="320"
      x-axis="month"
    />

    <h2>No yAxes — unchanged single-axis rendering</h2>
    <LineChart
      :data="climate"
      :categories="{ indoor: { name: 'Indoor', color: '#2662d9' } }"
      :height="320"
      x-axis="time"
    />
  </main>
</template>
