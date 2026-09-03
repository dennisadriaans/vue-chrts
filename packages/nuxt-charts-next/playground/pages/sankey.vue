<script setup lang="ts">
const energyFlow = {
  nodes: [
    { id: "solar", name: "Solar" },
    { id: "wind", name: "Wind" },
    { id: "grid", name: "Grid" },
    { id: "homes", name: "Homes" },
    { id: "business", name: "Business" },
    { id: "loss", name: "Loss" },
  ],
  links: [
    { source: "solar", target: "grid", value: 46 },
    { source: "wind", target: "grid", value: 34 },
    { source: "grid", target: "homes", value: 38 },
    { source: "grid", target: "business", value: 35 },
    { source: "grid", target: "loss", value: 7 },
  ],
};

const nodeColors: Record<string, string> = {
  solar: "#f59e0b",
  wind: "#38bdf8",
  grid: "#8b5cf6",
  homes: "#10b981",
  business: "#f43f5e",
  loss: "#94a3b8",
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 900px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Sankey charts</h1>

    <h2>Energy flow</h2>
    <SankeyChart
      :data="energyFlow"
      :height="420"
      :node-width="18"
      :node-padding="24"
      :node-color="node => nodeColors[String(node.id)] ?? '#64748b'"
      :link-color="link => nodeColors[String(link.source)] ?? '#64748b'"
    />

    <h2>Compact, without tooltip</h2>
    <SankeyChart
      :data="energyFlow"
      :height="260"
      :node-width="12"
      :node-padding="12"
      :duration="0"
      hide-tooltip
    />
  </main>
</template>
