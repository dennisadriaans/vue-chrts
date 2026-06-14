<script setup lang="ts">
import { monthly, type MonthRow } from "../data";

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#3b82f6" },
  mobile: { name: "Mobile", color: "#22c55e" },
};

// `yAxis` is typed `(keyof MonthRow)[]` — Ctrl+Space lists the row keys.
const yAxis: (keyof MonthRow)[] = ["desktop", "mobile"];
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Bar chart</h1>
    <BarChart
      :data="monthly"
      :categories="categories"
      :y-axis="yAxis"
      x-axis="month"
      :height="320"
      :radius="4"
    />
  </main>
</template>
