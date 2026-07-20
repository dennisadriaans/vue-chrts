<script setup lang="ts">
const data = {
  areas: [
    { id: "US", color: "#3b82f6" },
    { id: "NL", color: "#22c55e" },
  ],
  points: [
    { id: "ams", latitude: 52.3676, longitude: 4.9041, color: "#3b82f6" },
    { id: "nyc", latitude: 40.7128, longitude: -74.006, color: "#ef4444" },
  ],
  links: [{ source: "ams", target: "nyc" }],
}
</script>

<template>
  <div data-testid="chart-host">
    <TopoJSONMap
      :data="data"
      :height="300"
      :topo-json="WorldMapTopoJSON"
      map-feature-key="countries"
    />
  </div>
</template>
