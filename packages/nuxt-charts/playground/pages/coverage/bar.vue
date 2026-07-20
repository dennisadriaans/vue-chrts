<script setup lang="ts">
const data = [
  { quarter: "Q1", north: 120, south: 90 },
  { quarter: "Q2", north: 180, south: 140 },
  { quarter: "Q3", north: 150, south: 170 },
  { quarter: "Q4", north: 210, south: 160 },
]

const categories: Record<string, BulletLegendItemInterface> = {
  north: { name: "North", color: "#0ea5e9" },
  south: { name: "South", color: "#ec4899" },
}
</script>

<template>
  <div data-testid="chart-host">
    <BarChart
      :data="data"
      :height="300"
      :categories="categories"
      :y-axis="['north', 'south']"
      :x-formatter="(i: number) => data[i]?.quarter ?? ''"
      :group-padding="0.2"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
