<script setup lang="ts">
const data = {
  nodes: [
    { id: "visitors", label: "Visitors" },
    { id: "signup", label: "Signup" },
    { id: "trial", label: "Trial" },
    { id: "paid", label: "Paid" },
    { id: "churn", label: "Churn" },
  ],
  links: [
    { source: "visitors", target: "signup", value: 600 },
    { source: "signup", target: "trial", value: 380 },
    { source: "trial", target: "paid", value: 210 },
    { source: "trial", target: "churn", value: 170 },
  ],
}
</script>

<template>
  <div data-testid="chart-host">
    <SankeyChart
      :data="data"
      :height="300"
      :label="(n: (typeof data)['nodes'][number]) => n.label"
    />
  </div>
</template>
