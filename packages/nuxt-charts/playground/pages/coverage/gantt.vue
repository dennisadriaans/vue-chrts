<script setup lang="ts">
const start = new Date("2025-01-01").getTime()
const day = 86_400_000

const data = [
  { label: "Design", offset: 0, days: 5, kind: "design" },
  { label: "Build", offset: 4, days: 8, kind: "build" },
  { label: "Test", offset: 11, days: 4, kind: "test" },
  { label: "Ship", offset: 15, days: 2, kind: "build" },
]

const categories: Record<string, BulletLegendItemInterface> = {
  design: { name: "Design", color: "#a855f7" },
  build: { name: "Build", color: "#0ea5e9" },
  test: { name: "Test", color: "#f59e0b" },
}
</script>

<template>
  <div data-testid="chart-host">
    <GanttChart
      :data="data"
      :height="300"
      :categories="categories"
      :x="(d: (typeof data)[number]) => start + d.offset * day"
      :length="(d: (typeof data)[number]) => d.days * day"
      :type="(d: (typeof data)[number]) => d.kind"
      :x-formatter="(t: number) => new Date(t).toLocaleDateString('en-US')"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
