# nuxt-charts

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Nuxt module for [vue-chrts](https://github.com/dennisadriaans/vue-chrts/tree/main/packages/vue)

## Features

- 📊 Use beautiful chart components in your Nuxt applications
- 🔄 Auto-imports for all chart components
- 📊 Multiple types: Line, Bar, Area, Donut
- 🎨 Easily customizable
- 💡 Simple, intuitive API
- 🚀 Built with Vue 3 and TypeScript

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
  <LineChart
    :data="data"
    :categories="categories"
    :height="300"
    :xFormatter="xFormatter"
    xLabel="Month"
    yLabel="Amount"
  />
  </div>
</template>

<script setup>
import { LineChart } from 'vue-chrts';

const data = [
  { month: 'Jan', sales: 100, profit: 50 },
  { month: 'Feb', sales: 120, profit: 55 },
  { month: 'Mar', sales: 180, profit: 80 },
  { month: 'Apr', sales: 110, profit: 40 },
  { month: 'May', sales: 90, profit: 30 },
];

const categories = {
  sales: {
    name: 'Sales',
    color: '#3b82f6'
  },
  profit: {
    name: 'Profit', 
    color: '#10b981'
  }
};

const xFormatter = (i) => data[i].month;
</script>
```

## Available Components

- `AreaChart` - Area chart
- `AreaStackedChart` - Stacked area chart
- `LineChart` - Line chart
- `BarChart` - Bar chart
- `DonutChart` - Donut chart

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
