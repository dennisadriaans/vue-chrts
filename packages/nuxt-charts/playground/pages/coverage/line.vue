<script setup lang="ts">
const data = [
  { month: "Jan", revenue: 4200, cost: 2400 },
  { month: "Feb", revenue: 3800, cost: 2100 },
  { month: "Mar", revenue: 5200, cost: 2800 },
  { month: "Apr", revenue: 6100, cost: 3300 },
  { month: "May", revenue: 5600, cost: 3000 },
  { month: "Jun", revenue: 7000, cost: 3600 },
]

const categories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: "Revenue", color: "#8b5cf6" },
  cost: { name: "Cost", color: "#f97316" },
}
</script>

<template>
  <div data-testid="chart-host">
    <LineChart
      :data="data"
      :height="300"
      :categories="categories"
      :y-axis="['revenue', 'cost']"
      :x-formatter="(i: number) => data[i]?.month ?? ''"
      :curve-type="CurveType.Linear"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
