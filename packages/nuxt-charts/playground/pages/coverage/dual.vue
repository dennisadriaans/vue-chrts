<script setup lang="ts">
const data = [
  { month: "Jan", visits: 1200, conversion: 3.2 },
  { month: "Feb", visits: 1800, conversion: 4.1 },
  { month: "Mar", visits: 1500, conversion: 3.8 },
  { month: "Apr", visits: 2400, conversion: 5.2 },
  { month: "May", visits: 2100, conversion: 4.7 },
  { month: "Jun", visits: 2800, conversion: 6.0 },
]

const barCategories: Record<string, BulletLegendItemInterface> = {
  visits: { name: "Visits", color: "#3b82f6" },
}

const lineCategories: Record<string, BulletLegendItemInterface> = {
  conversion: { name: "Conversion %", color: "#ef4444" },
}
</script>

<template>
  <div data-testid="chart-host">
    <DualChart
      :data="data"
      :height="300"
      :bar-categories="barCategories"
      :line-categories="lineCategories"
      :bar-y-axis="['visits']"
      :line-y-axis="['conversion']"
      :x-formatter="(i: number) => data[i]?.month ?? ''"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
