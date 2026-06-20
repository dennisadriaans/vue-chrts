<script setup lang="ts">
import { radar } from "../data";

const categories: Record<string, BulletLegendItemInterface> = {
  productA: { name: "Product A", color: "#2662d9" },
  productB: { name: "Product B", color: "#e23670" },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Radar charts</h1>

    <h2>Radar Chart</h2>
    <RadarChart
      :data="radar"
      :categories="categories"
      data-key="metric"
      :height="360"
      :legend-position="LegendPosition.BottomCenter"
    />

    <h2>Radar Chart - No Radius Axis</h2>
    <RadarChart
      :data="radar"
      :categories="categories"
      data-key="metric"
      :height="360"
      :legend-position="LegendPosition.BottomCenter"
      hide-radius-axis
    />
  </main>
</template>
