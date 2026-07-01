<script setup lang="ts">
const categories: Record<string, BulletLegendItemInterface> = {
  visits: { name: "Visits", color: "#2662d9" },
  signups: { name: "Signups", color: "#e23670" },
  trials: { name: "Trials", color: "#e88c30" },
  paid: { name: "Paid", color: "#af57db" },
};
const data = [5000, 2300, 1200, 480];

// layered variant — larger, curved, nested layers
const layeredCategories: Record<string, BulletLegendItemInterface> = {
  visitors: { name: "Visitors", color: "#0ea5e9" },
  leads: { name: "Leads", color: "#a855f7" },
  qualified: { name: "Qualified", color: "#fc5e2f" },
  proposals: { name: "Proposals", color: "#f59e0b" },
  won: { name: "Won", color: "#10b981" },
};
const layeredData = [12000, 7200, 4100, 2300, 1200];
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

    <h2>Funnel Chart - Layered</h2>
    <p style="color: #6b7280">
      Curved, nested layers add depth while preserving the proportions of each
      conversion stage.
    </p>
    <FunnelChart
      variant="layered"
      :data="layeredData"
      :categories="layeredCategories"
      :height="360"
    />
  </main>
</template>
