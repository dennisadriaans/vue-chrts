<script setup lang="ts">
import { browserData, browserCategories } from "../data";
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Radial bar charts</h1>

    <h2>Radial Bar Chart</h2>
    <RadialBarChart
      :data="browserData"
      :categories="browserCategories"
      :height="360"
      :corner-radius="4"
      :legend-position="LegendPosition.BottomCenter"
    />

    <h2>Radial Bar Chart - No Background</h2>
    <RadialBarChart
      :data="browserData"
      :categories="browserCategories"
      :height="360"
      :corner-radius="4"
      :background="false"
      :legend-position="LegendPosition.BottomCenter"
    />
  </main>
</template>
