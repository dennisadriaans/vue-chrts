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

    <h2>Radar Chart - Outline with Dots</h2>
    <RadarChart
      :data="radar"
      :categories="categories"
      data-key="metric"
      :height="360"
      :legend-position="LegendPosition.BottomCenter"
      variant="lines"
      dot-variant="colored-border"
      :dot-size="4"
    />

    <h2>Radar Chart - Circular Grid</h2>
    <RadarChart
      :data="radar"
      :categories="categories"
      data-key="metric"
      :height="360"
      :legend-position="LegendPosition.BottomCenter"
      grid-type="circle"
      :fill-opacity="0.25"
      hide-radius-axis
    />

    <h2>Radar Chart - Custom Axes and Markers</h2>
    <RadarChart
      :data="radar"
      :categories="categories"
      data-key="metric"
      :height="400"
      :legend-position="LegendPosition.BottomCenter"
      legend-variant="circle-outline"
      grid-type="circle"
      dot-variant="ping"
      :dot-size="5"
      :fill-opacity="0.18"
      :radius-axis-angle="45"
      outer-radius="62%"
      :angle-axis-tick-size="24"
      tooltip-variant="frosted-glass"
      tooltip-roundness="xl"
      :angle-formatter="(value) => String(value).toUpperCase()"
    />
  </main>
</template>
