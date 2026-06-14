<script setup lang="ts">
// v2 donut API: positional `data: number[]` zipped against `categories`.
const categories: Record<string, BulletLegendItemInterface> = {
  chrome: { name: "Chrome", color: "#3b82f6" },
  safari: { name: "Safari", color: "#22c55e" },
  firefox: { name: "Firefox", color: "#f59e0b" },
  edge: { name: "Edge", color: "#ef4444" },
};
const data = [275, 200, 187, 90];
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Donut chart</h1>
    <DonutChart
      :data="data"
      :categories="categories"
      :radius="120"
      :arc-width="40"
      :type="DonutType.Full"
      :height="320"
    />
  </main>
</template>
