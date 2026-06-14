<script setup lang="ts">
import { monthly } from "../data";

// `categories`, `CurveType`, `BulletLegendItemInterface` and `AreaChart`
// are all auto-imported by the module — no explicit imports needed.
const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#3b82f6" },
  mobile: { name: "Mobile", color: "#22c55e" },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Area chart</h1>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.BottomCenter"
      stacked
    />
  </main>
</template>
