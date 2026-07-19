<script setup lang="ts">
const data = {
  nodes: [
    { id: "ingest", label: "Ingest" },
    { id: "transform", label: "Transform" },
    { id: "store", label: "Store" },
    { id: "serve", label: "Serve" },
  ],
  links: [
    { source: "ingest", target: "transform" },
    { source: "transform", target: "store" },
    { source: "store", target: "serve" },
  ],
}
</script>

<template>
  <div data-testid="chart-host">
    <DagreGraph :data="data" :height="300" />
  </div>
</template>
