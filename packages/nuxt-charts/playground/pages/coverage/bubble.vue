<script setup lang="ts">
const data = [
  { name: "Alpha", group: "core", x: 10, y: 20, size: 30 },
  { name: "Beta", group: "core", x: 25, y: 45, size: 55 },
  { name: "Gamma", group: "edge", x: 40, y: 30, size: 40 },
  { name: "Delta", group: "edge", x: 60, y: 55, size: 70 },
  { name: "Epsilon", group: "core", x: 75, y: 25, size: 25 },
]

const categories: Record<string, BulletLegendItemInterface> = {
  core: { name: "Core", color: "#6366f1" },
  edge: { name: "Edge", color: "#14b8a6" },
}
</script>

<template>
  <div data-testid="chart-host">
    <BubbleChart
      :data="data"
      :height="300"
      :categories="categories"
      category-key="group"
      :x-accessor="(d: (typeof data)[number]) => d.x"
      :y-accessor="(d: (typeof data)[number]) => d.y"
      :size-accessor="(d: (typeof data)[number]) => d.size"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
