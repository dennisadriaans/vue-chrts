<script setup lang="ts">
const data = [45, 25, 20, 10]

const categories: Record<string, BulletLegendItemInterface> = {
  direct: { name: "Direct", color: "#22c55e" },
  organic: { name: "Organic", color: "#3b82f6" },
  referral: { name: "Referral", color: "#f59e0b" },
  social: { name: "Social", color: "#ef4444" },
}
</script>

<template>
  <div data-testid="chart-host">
    <DonutChart
      :data="data"
      :height="300"
      :radius="120"
      :categories="categories"
      :type="DonutType.Half"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
