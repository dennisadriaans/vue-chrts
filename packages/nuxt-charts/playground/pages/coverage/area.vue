<script setup lang="ts">
const data = [
  { month: "Jan", desktop: 2500, mobile: 1400 },
  { month: "Feb", desktop: 1500, mobile: 1700 },
  { month: "Mar", desktop: 3000, mobile: 2100 },
  { month: "Apr", desktop: 4000, mobile: 2600 },
  { month: "May", desktop: 4500, mobile: 3100 },
  { month: "Jun", desktop: 2800, mobile: 2400 },
]

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#22c55e" },
  mobile: { name: "Mobile", color: "#3b82f6" },
}
</script>

<template>
  <div data-testid="chart-host">
    <AreaChart
      :data="data"
      :height="300"
      :categories="categories"
      :y-axis="['desktop', 'mobile']"
      :x-formatter="(i: number) => data[i]?.month ?? ''"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
