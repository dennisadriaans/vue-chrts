<script setup lang="ts">
import { computed, ref } from "vue";
import { monthly, dailyVisitors, type MonthRow, type DailyRow } from "../data";

// --- Bar Chart (default, single series) ---
const categoriesDesktop: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
};
const yAxisDesktop: (keyof MonthRow)[] = ["desktop"];

// --- Bar Chart - Horizontal ---
// same data, same categories, orientation="horizontal"

// --- Bar Chart - Multiple ---
const categoriesMultiple: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};
const yAxisMultiple: (keyof MonthRow)[] = ["desktop", "mobile"];

// --- Bar Chart - Interactive ---
const activeChart = ref<"desktop" | "mobile">("desktop");

const totalDesktop = dailyVisitors.reduce((s, r) => s + r.desktop, 0);
const totalMobile = dailyVisitors.reduce((s, r) => s + r.mobile, 0);

const interactiveCategories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  desktop: { name: "Desktop", color: "#2662d9", hidden: activeChart.value !== "desktop" },
  mobile: { name: "Mobile", color: "#e23670", hidden: activeChart.value !== "mobile" },
}));

const interactiveYAxis = computed<(keyof DailyRow)[]>(() => [activeChart.value]);

const xFormatter = (v: unknown) =>
  new Date(String(v)).toLocaleDateString("en-US", { month: "short", day: "numeric" });
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Bar charts</h1>

    <h2>Bar Chart</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesDesktop"
      :y-axis="yAxisDesktop"
      x-axis="month"
      :height="320"
      :radius="4"
      :hide-legend="true"
    />

    <h2>Bar Chart - Cubes</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesDesktop"
      :y-axis="yAxisDesktop"
      x-axis="month"
      :height="320"
      variant="cubes"
      :hide-legend="true"
      :y-grid-line="false"
    />

    <h2>Bar Chart - Cubes Taper</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesDesktop"
      :y-axis="yAxisDesktop"
      x-axis="month"
      :height="320"
      variant="cubes"
      :cube-size="10"
      :cube-min-size="1"
      :hide-legend="true"
      :y-grid-line="true"
    />

    <h2>Bar Chart - Cubes Stacked</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesMultiple"
      :y-axis="yAxisMultiple"
      x-axis="month"
      :height="320"
      variant="cubes"
      stacked
      :y-grid-line="false"
    />

    <h2>Bar Chart - Cubes Grouped</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesMultiple"
      :y-axis="yAxisMultiple"
      x-axis="month"
      :height="320"
      variant="cubes"
      :bar-gap="2"
      :bar-category-gap="'20%'"
      :y-grid-line="false"
    />

    <h2>Bar Chart - Horizontal</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesDesktop"
      :y-axis="yAxisDesktop"
      x-axis="month"
      :height="320"
      :radius="4"
      orientation="horizontal"
      :hide-legend="true"
    />

    <h2>Bar Chart - Multiple</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesMultiple"
      :y-axis="yAxisMultiple"
      x-axis="month"
      :height="320"
      :radius="4"
    />

    <!-- v2 parity: valueLabel renders the value above each bar (LabelList). -->
    <h2>Bar Chart - Value Labels (valueLabel)</h2>
    <BarChart
      :data="monthly"
      :categories="categoriesMultiple"
      :y-axis="yAxisMultiple"
      x-axis="month"
      :height="320"
      :radius="4"
      :value-label="{
        label: (d) => String(d.y),
        labelSpacing: 8,
        labelFontSize: 10,
        color: '#374151',
      }"
    />

    <h2>Bar Chart - Interactive</h2>
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden">
      <div style="display: flex; border-bottom: 1px solid #e5e7eb">
        <div style="flex: 1; padding: 1rem 1.5rem">
          <div style="font-weight: 600">Bar Chart - Interactive</div>
          <div style="font-size: 0.875rem; color: #6b7280">Showing total visitors for the last 3 months</div>
        </div>
        <div style="display: flex">
          <button
            v-for="key in ['desktop', 'mobile'] as const"
            :key="key"
            :style="{
              flex: 1,
              padding: '1rem 1.5rem',
              textAlign: 'left',
              background: activeChart === key ? '#f3f4f6' : 'white',
              border: 'none',
              borderLeft: '1px solid #e5e7eb',
              cursor: 'pointer',
            }"
            @click="activeChart = key"
          >
            <div style="font-size: 0.75rem; color: #6b7280">{{ key === 'desktop' ? 'Desktop' : 'Mobile' }}</div>
            <div style="font-size: 1.5rem; font-weight: 700">
              {{ (key === 'desktop' ? totalDesktop : totalMobile).toLocaleString() }}
            </div>
          </button>
        </div>
      </div>
      <div style="padding: 0.5rem">
        <BarChart
          :data="dailyVisitors"
          :categories="interactiveCategories"
          :y-axis="interactiveYAxis"
          x-axis="date"
          :height="250"
          :radius="0"
          :x-formatter="xFormatter"
          :hide-legend="true"
        />
      </div>
    </div>
  </main>
</template>
