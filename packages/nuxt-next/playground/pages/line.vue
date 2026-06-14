<script setup lang="ts">
import { monthly } from "../data";

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#3b82f6" },
  mobile: { name: "Mobile", color: "#22c55e" },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Line chart</h1>
    <LineChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.Natural"
    />
  </main>
</template>
