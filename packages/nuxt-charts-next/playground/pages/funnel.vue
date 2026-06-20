<script setup lang="ts">
const categories: Record<string, BulletLegendItemInterface> = {
  visits: { name: "Visits", color: "#2662d9" },
  signups: { name: "Signups", color: "#e23670" },
  trials: { name: "Trials", color: "#e88c30" },
  paid: { name: "Paid", color: "#af57db" },
};
const data = [5000, 2300, 1200, 480];
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Funnel charts</h1>

    <h2>Funnel Chart</h2>
    <FunnelChart
      :data="data"
      :categories="categories"
      :height="360"
      :legend-position="LegendPosition.BottomCenter"
    />

    <h2>Funnel Chart - Rectangle</h2>
    <FunnelChart
      :data="data"
      :categories="categories"
      :height="360"
      last-shape-type="rectangle"
      :legend-position="LegendPosition.BottomCenter"
    />
  </main>
</template>
