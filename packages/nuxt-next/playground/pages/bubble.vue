<script setup lang="ts">
import { bubbles } from "../data";

const categories: Record<string, BulletLegendItemInterface> = {
  A: { name: "Group A", color: "#3b82f6" },
  B: { name: "Group B", color: "#22c55e" },
  C: { name: "Group C", color: "#f59e0b" },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Bubble chart</h1>
    <BubbleChart
      :data="bubbles"
      :categories="categories"
      x-accessor="x"
      y-accessor="y"
      size-accessor="size"
      category-key="group"
      :size-range="[60, 400]"
      :height="360"
    />
  </main>
</template>
