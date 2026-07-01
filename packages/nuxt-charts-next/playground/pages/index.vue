<script setup lang="ts">
const charts = [
  { to: "/area", label: "Area chart" },
  { to: "/bar", label: "Bar chart" },
  { to: "/line", label: "Line chart" },
  { to: "/donut", label: "Donut chart" },
  { to: "/bubble", label: "Bubble chart" },
  { to: "/radar", label: "Radar chart" },
  { to: "/funnel", label: "Funnel chart" },
  { to: "/radialbar", label: "Radial bar chart" },
  { to: "/candlestick", label: "Candlestick chart" },
  { to: "/status-tracker", label: "Status tracker chart" },
];
</script>

<template>
  <main style="font-family: sans-serif; max-width: 720px; margin: 2rem auto">
    <h1>nuxt-charts v3 playground</h1>
    <p>Adapters composing <code>vccs</code> from the v2 config-prop API.</p>
    <ul>
      <li v-for="c in charts" :key="c.to">
        <NuxtLink :to="c.to">{{ c.label }}</NuxtLink>
      </li>
    </ul>
  </main>
</template>
