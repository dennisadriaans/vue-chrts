# Vue-chrts

A Vue 3 charts package inspired by [Tremor](https://tremor.so/), built on top of [Unovis](https://unovis.dev). Vue-Chrts provides beautiful, responsive charts for your Vue applications with minimal setup.

![alt text](https://nuxtcharts.com/og-image.png)

[Check the docs and examples](https://nuxtcharts.com/docs)

## Features

- 📊 Multiple chart types: Line, Bar, Area, Stacked Area, Donut
- 🎨 Customizable
- 📱 Responsive design
- 💡 Simple, intuitive API
- 🚀 Built with Vue 3 and TypeScript


[Check the docs and examples](https://nuxtcharts.com/docs)

## Installation Nuxt

```bash
# npm
npm install nuxt-charts

# yarn
yarn add nuxt-charts

# pnpm
pnpm add nuxt-charts

# Add module to your nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-charts"]
});
```

## Installation Vue.js

```bash
# npm
npm install vue-chrts

# yarn
yarn add vue-chrts

# pnpm
pnpm add vue-chrts

# import component
import { LineChart } from 'vue-chrts';

```

[Check the docs and examples](https://nuxtcharts.com/docs)

## Usage Example

```vue
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

<template>
  <LineChart
    :data="data"
    :categories="categories"
    :height="300"
    :xFormatter="xFormatter"
    xLabel="Month"
    yLabel="Amount"
  />
</template>
```
[Check the docs and examples](https://nuxtcharts.com/docs)

## Available Charts

- `LineChart`
- `BarChart`
- `AreaChart`
- `AreaStackedChart`
- `DonutChart`

## Credits

This library is inspired by [Tremor](https://tremor.so/) and built on top of [Unovis](https://unovis.dev).

## License

MIT