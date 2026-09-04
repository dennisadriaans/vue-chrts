<script setup lang="ts">
const categories = {
  value: { name: "Pathological value", color: "var(--chart-color-0)" },
};
const pathological = [
  { label: "zero", value: 0 },
  { label: "negative", value: -12 },
  { label: "missing" },
  { label: "NaN", value: Number.NaN },
  { label: "infinity", value: Infinity },
  { label: "huge", value: Number.MAX_SAFE_INTEGER },
  { label: "tiny", value: Number.MIN_VALUE },
  { label: "Unicode 🧪 — an intentionally very long label", value: 4 },
];
const dense = Array.from({ length: 10_000 }, (_, index) => ({ label: index, value: Math.sin(index / 40) * 100 }));
const invalidDonut = [0, Number.NaN, Infinity, -4];
</script>

<template>
  <main class="page">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Data torture tests</h1>
    <p>Invalid, extreme, Unicode, mixed-sign, empty, one-point, and dense data.</p>
    <BarChart :data="pathological" :categories="categories" :y-axis="['value']" x-axis="label" :height="260" aria-label="Pathological bar data" />
    <LineChart :data="dense" :categories="categories" x-axis="label" :height="260" aria-label="Ten thousand point sampled line" />
    <DonutChart :data="invalidDonut" :categories="categories" :height="220" aria-label="Partially invalid donut" />
    <BarChart :data="[]" :categories="categories" :y-axis="['value']" :height="180" aria-label="Empty chart" />
  </main>
</template>
