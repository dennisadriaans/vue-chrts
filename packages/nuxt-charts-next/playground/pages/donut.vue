<script setup lang="ts">
import { computed } from "vue";
import { browserData, browserCategories } from "../data";

const total = computed(() => browserData.reduce((s, v) => s + v, 0));
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Donut / Pie charts</h1>

    <h2>Pie Chart</h2>
    <DonutChart
      :data="browserData"
      :categories="browserCategories"
      :radius="120"
      :arc-width="120"
      :height="280"
    />

    <h2>Donut Chart</h2>
    <DonutChart
      :data="browserData"
      :categories="browserCategories"
      :radius="120"
      :arc-width="40"
      :height="280"
    />

    <h2>Donut Chart - with total</h2>
    <div style="position: relative; display: inline-block; width: 100%">
      <DonutChart
        :data="browserData"
        :categories="browserCategories"
        :radius="120"
        :arc-width="40"
        :height="280"
        :hide-legend="true"
      />
      <div
style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        text-align: center;
        pointer-events: none;
      ">
        <div style="font-size: 1.75rem; font-weight: 700; line-height: 1">{{ total.toLocaleString() }}</div>
        <div style="font-size: 0.75rem; color: #6b7280">Visitors</div>
      </div>
    </div>
  </main>
</template>
