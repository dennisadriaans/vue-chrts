# nuxt-charts

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

> Nuxt module for vue-chrts

## Features

- 📊 Use beautiful chart components in your Nuxt applications
- 🔄 Auto-imports for all chart components
- 🎛️ Configure which components to include
- 🪶 Tree-shakable - only import what you use

## Installation

```bash
# npm
npm install nuxt-charts

# yarn
yarn add nuxt-charts

# pnpm
pnpm add nuxt-charts
```

## Usage

Add the module to your Nuxt config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-charts"]
});
```

Then use the components in your Nuxt application:

```vue
<template>
  <div class="chart-wrapper">
    <ChrtLineChart
      :data="data"
      :height="300"
      :accessor="accessor"
      :x-axis-title="xAxisTitle"
    />
  </div>
</template>

<script setup>
// The types are auto-imported
const data = ref([
  { date: "2023-01", value: 100 },
  { date: "2023-02", value: 200 },
  { date: "2023-03", value: 150 },
]);

const accessor = (d) => d.value;
const xAxisTitle = "Month";
</script>
```

## Available Components

- `ChrtAreaChart` - Area chart
- `ChrtAreaStackedChart` - Stacked area chart
- `ChrtLineChart` - Line chart
- `ChrtBarChart` - Bar chart
- `ChrtDonutChart` - Donut chart

## Auto-imported Types

The following types are auto-imported:

- `LegendPosition`
- `CurveType`
- `Orientation`
- `BulletLegendItemInterface`

## License

MIT

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-charts/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-charts
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-charts.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-charts
