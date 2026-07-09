---
title: Vue Charts - Beautiful, Responsive, and Easy-to-Use
description: Create stunning, interactive charts in your Vue applications with our easy-to-use library. Choose from a wide variety of chart types and customize them to fit your needs.
---

# Vue Charts

Creating beautiful and interactive charts in your Vue applications has never been easier. With the [vue-chrts](https://github.com/dennisadriaans/vue-chrts){target="_blank"} package (it's not a typo), you can build stunning, responsive charts with just a few lines of code.

Not using Nuxt? No problem you can install vue-chrts in any Vue project.

## Why Choose Vue charts

*   **Easy to Use:** Vue charts is designed to be easy to use, even for beginners. You can create your first chart in minutes.
*   **Responsive:** Vue charts is fully responsive and will look great on any device.
*   **Customizable:** You can customize every aspect of Vue charts, from the colors to the tooltips.
*   **Wide Variety of Chart Types:** We offer a wide variety of chart types, including line charts, bar charts, donut charts, and more.


## Getting Started

To add Vue charts to your project, install the library via npm, pnpm or yarn (see the [Vue Charts installation guide](/docs/getting-started/vue-chrts) for more details):


::code-group
```bash [pnpm]
pnpm add vue-chrts
```
```bash [npm]
npm install vue-chrts
```
```bash [yarn]
yarn add vue-chrts
```
::


Then, import the chart component and use it in your Vue application:

::code-group
:::code-preview{icon="i-lucide-eye" label="Preview"}
<ExamplesAreaChartPreview />
:::
```vue [Example.vue]

<script lang="ts" setup>
import { AreaChart } from "vue-chrts";

interface AreaChartItem {
  date: string
  desktop: number
  mobile: number
}

const categories: ComputedRef<Record<string, BulletLegendItemInterface>> =
  computed(() => ({
    desktop: {
      name: 'Desktop',
      color: '#3b82f6',
    },
    mobile: {
      name: 'Mobile',
      color: '#22c55e',
    },
  }))

const AreaChartData: AreaChartItem[] = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-02', desktop: 180, mobile: 97 },
  { date: '2024-04-03', desktop: 167, mobile: 120 },
  { date: '2024-04-04', desktop: 260, mobile: 240 },
  { date: '2024-04-05', desktop: 240, mobile: 290 },
]

const xFormatter = (tick: number): string => {
  return `${AreaChartData[tick]?.date}`
}
</script>

<template>
  <div id="app">
    <AreaChart
      :data="AreaChartData"
      :height="300"
      :categories="categories"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>
```
::


## Examples

Vue charts ([vue-chrts](https://nuxtcharts.com/docs/charts/area-chart){target="_blank"}) can render any chart and are beautiful by design.

Vue charts are ideal for SaaS projects and finance dashboards, providing real-time data visualization, customizable chart types, and seamless integration with modern Vue workflows. 

<ExamplesChartShowcase></ExamplesChartShowcase>

### Advanced Data Visualization
The `vue-chrts` package is a high-level charting library built on top of [Unovis](https://unovis.dev/), offering a lightweight and high-performance solution specifically for the Vue ecosystem. It provides a wide range of visualization options that are both easy to implement and highly customizable via Tailwind CSS.

Whether you need [Area Charts](/docs/charts/area-chart), [Line Charts](/docs/charts/line-chart), or [Bar Charts](/docs/charts/bar-chart) for standard metrics, or more complex visualizations like [Bubble Charts](/docs/charts/bubble-chart) for multi-dimensional data and [Gantt Charts](/docs/charts/gantt-chart) for project timelines, `vue-chrts` has you covered. It also supports specialized needs such as **TopoJSON maps** for geospatial data visualization, making it a versatile choice for any modern dashboard.

### Powerful Customization
Tailor your visualizations to match your brand identity with deep customization options. Enhance user experience with interactive [Tooltips](/docs/customize/tooltips), add data clarity using custom [Markers](/docs/customize/markers), and provide clear context with flexible [Legends](/docs/customize/legend). Every element is designed to be accessible and responsive out of the box.

## Learn More

For more information on how to integrate and customize your charts, check out the [guide to using Vue Charts](/docs/getting-started/vue-chrts).
