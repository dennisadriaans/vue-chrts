# 📊 Vue-chrts

<div align="center">
  
![Vue-chrts](https://img.shields.io/badge/Vue--chrts-v0.1.0--beta.2-42b883)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](https://www.typescriptlang.org/)
[![Unovis](https://img.shields.io/badge/Unovis-1.5.1-0088cc)](https://unovis.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

A modern Vue 3 chart library, inspired by [Tremor](https://tremor.so/) and built on [Unovis](https://unovis.dev/), Vue-charts provides beautiful data visualizations with minimal configuration.

![alt text](https://nuxtcharts.com/og-image.png)

## ✨ Features

- 📈 **Multiple Chart Types** - Area, Stacked Area, Line, Bar, and Donut charts
- 🎨 **Customizable** - Extensive styling options with sensible defaults
- 🔍 **Interactive** - Built-in tooltips and crosshairs
- 📱 **Responsive** - Charts adapt to container size
- 🔢 **Strongly Typed** - Full TypeScript support
- 🧩 **Modular** - Import only what you need
- 🔧 **Easy to Use** - Simple API with Vue 3's Composition API

## 📦 Installation

```bash
# npm
npm install vue-chrts

# yarn
yarn add vue-chrts

# pnpm
pnpm add vue-chrts
```

## 🚀 Quick Start

```vue
<script setup lang="ts">
import { LineChart } from 'vue-chrts';
import { ref } from 'vue';

const data = ref([
  { date: '2023-01-01', value: 100 },
  { date: '2023-02-01', value: 150 },
  { date: '2023-03-01', value: 125 },
  { date: '2023-04-01', value: 200 },
]);
</script>

<template>
  <LineChart
    :data="data"
    x-key="date"
    :y-keys="['value']"
    :height="300"
    :categories="[{ key: 'value', name: 'Revenue', color: '#42b883' }]"
  />
</template>
```

## 📊 Available Charts

- **LineChart** - Visualize trends over time
- **AreaChart** - Emphasize volume under a line
- **AreaStackedChart** - Compare multiple series in a stacked layout
- **BarChart** - Compare values across categories
- **DonutChart** - Display part-to-whole relationships

## 🛠️ Configuration

Each chart component accepts various props to customize appearance and behavior:

```vue
<LineChart
  :data="data"
  x-key="date"
  :y-keys="['value', 'target']"
  :height="300"
  curve-type="monotone"
  :show-dots="true"
  :legend-position="'top'"
  :categories="[
    { key: 'value', name: 'Revenue', color: '#42b883' },
    { key: 'target', name: 'Target', color: '#2c3e50' }
  ]"
  :grid-lines="true"
  :x-axis-format="(d) => formatDate(d)"
  :tooltip-enabled="true"
/>
```

## 📚 Documentation

Check out our documentation for detailed API references and examples:

[Full Documentation](#) (Coming soon)

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Start dev server with hot reload
pnpm dev

# Build for production
pnpm build
```

## 📄 License

MIT

---

Built with [Vue 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/), and [Unovis](https://unovis.dev/)