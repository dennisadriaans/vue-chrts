<script setup lang="ts">
import { monthly } from "../data";

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Area charts</h1>

    <h2>Area Chart</h2>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.MonotoneX"
    />

    <h2>Area Chart - Stacked</h2>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.MonotoneX"
      stacked
    />

    <h2>Area Chart - Step</h2>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.Step"
    />

    <!-- v2 parity: markerConfig renders dots on the area outline. -->
    <h2>Area Chart - Markers (markerConfig)</h2>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.MonotoneX"
      :marker-config="{
        desktop: { type: 'circle', size: 6, strokeWidth: 2, color: '#2662d9' },
        mobile: { type: 'circle', size: 6, strokeWidth: 2, color: '#e23670' },
      }"
    />

    <!-- v2 parity: lineDashArray (number[][]) -> stroke-dasharray. -->
    <h2>Area Chart - Dashed (lineDashArray)</h2>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.MonotoneX"
      hide-area
      :line-dash-array="[[6, 4]]"
    />

    <!-- v2 parity: gradientStops fills each area with a vertical gradient. -->
    <h2>Area Chart - Gradient (gradientStops)</h2>
    <AreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-axis="month"
      :curve-type="CurveType.MonotoneX"
      :gradient-stops="[
        { offset: '0%', stopOpacity: 0.7 },
        { offset: '100%', stopOpacity: 0 },
      ]"
    />

    <h2>Zoomable Area Chart</h2>
    <p style="font-size: 0.85rem; color: #666; margin: 0 0 0.5rem">
      Scroll / pinch to zoom. Drag to pan. Y-axis rescales to visible range.
    </p>
    <ZoomableAreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-key="month"
      :curve-type="CurveType.MonotoneX"
    />

    <h2>Zoomable Area Chart — line only</h2>
    <ZoomableAreaChart
      :data="monthly"
      :categories="categories"
      :height="320"
      x-key="month"
      :curve-type="CurveType.MonotoneX"
      hide-area
      :fill-opacity="0"
    />
  </main>
</template>
