<script setup lang="ts">
import { monthly } from "../data";

const categoriesSingle: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
};

const categoriesMultiple: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Line charts</h1>

    <h2>Line Chart</h2>
    <LineChart
      :data="monthly"
      :categories="categoriesSingle"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.Natural"
      :hide-legend="true"
    />

    <h2>Line Chart - Linear</h2>
    <LineChart
      :data="monthly"
      :categories="categoriesSingle"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.Linear"
      :hide-legend="true"
    />

    <h2>Line Chart - Step</h2>
    <LineChart
      :data="monthly"
      :categories="categoriesSingle"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.Step"
      :hide-legend="true"
    />

    <h2>Line Chart - Multiple</h2>
    <LineChart
      :data="monthly"
      :categories="categoriesMultiple"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.Natural"
    />
  </main>
</template>
