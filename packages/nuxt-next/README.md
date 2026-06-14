# nuxt-charts (v3)

Nuxt module for [vccs](https://vue-charts.com) — an unofficial Vue 3 port of
Recharts. v3 keeps the familiar **config-prop API** from v2 (`:data`,
`:categories`, `:yAxis`, `:height`, …) but renders it through `vccs` instead of
Unovis. You keep your templates; the engine underneath changed.

## Features

- 📊 Config-driven chart components — no compositional boilerplate
- 🔄 Auto-imported components, enums, and prop types
- 🧮 Charts: Area, Bar, Line, Donut, Bubble
- 🧠 Strong typing — `keyof T` autocomplete on axis keys, enum/literal suggestions
- 🚀 Vue 3 + TypeScript, SSR-safe (charts render client-side)

## Installation

```bash
pnpm add nuxt-charts
# or: npm install nuxt-charts / yarn add nuxt-charts
```

`vccs` and `motion-v` ship as dependencies — no extra install needed.

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-charts"],
});
```

```vue
<template>
  <LineChart
    :data="data"
    :categories="categories"
    :height="300"
    x-axis="month"
    :curve-type="CurveType.MonotoneX"
  />
</template>

<script setup lang="ts">
// LineChart, CurveType and BulletLegendItemInterface are auto-imported.
const data = [
  { month: "Jan", sales: 100, profit: 50 },
  { month: "Feb", sales: 120, profit: 55 },
  { month: "Mar", sales: 180, profit: 80 },
];

const categories: Record<string, BulletLegendItemInterface> = {
  sales: { name: "Sales", color: "#3b82f6" },
  profit: { name: "Profit", color: "#10b981" },
};
</script>
```

## Available components

| Component     | Renders via `vccs` |
| ------------- | ------------------ |
| `AreaChart`   | `AreaChart` + `Area` |
| `BarChart`    | `BarChart` + `Bar` |
| `LineChart`   | `LineChart` + `Line` |
| `DonutChart`  | `PieChart` + `Pie` |
| `BubbleChart` | `ScatterChart` + `Scatter` |

`SankeyChart` is planned for the next iteration (the published `vccs` release
does not yet export a Sankey chart).

## Module options

```ts
export default defineNuxtConfig({
  modules: ["nuxt-charts"],
  nuxtCharts: {
    prefix: "",        // prefix component names, e.g. "V" -> <VBarChart>
    global: true,      // register globally (no import needed)
    autoImports: true, // auto-import enums and prop types
    include: [],       // [] = all; or a subset, e.g. ["BarChart", "LineChart"]
  },
});
```

## Auto-imported enums & types

- Enums: `CurveType`, `LegendPosition`, `Orientation`, `DonutType`
- Types: `AreaChartProps`, `BarChartProps`, `LineChartProps`, `BubbleChartProps`,
  `DonutChartProps`, `BulletLegendItemInterface`, `AxisConfig`, `TooltipConfig`,
  `ValueLabel`

## Migrating from v2

The API is intentionally close to v2. Notes:

- `BarChart` keeps `:yAxis` (value keys) and `:xAxis` (category key).
- Unovis-only props (`crosshairConfig`, `markerConfig`, `xExplicitTicks`, …) are
  accepted but inert — they're marked `@deprecated` and have no effect, so old
  templates keep type-checking.
- `legendStyle` as a raw CSS string is ignored; pass an object instead.

## License

MIT
