# nuxt-charts (v3)

Nuxt module for [vccs](https://vue-charts.com) — an unofficial Vue 3 port of
Recharts. v3 keeps the familiar **config-prop API** from v2 (`:data`,
`:categories`, `:yAxis`, `:height`, …) but renders it through `vccs` instead of
Unovis. You keep your templates; the engine underneath changed.

## Features

- 📊 Config-driven chart components — no compositional boilerplate
- 🔄 Auto-imported components, enums, and prop types
- 🧮 Charts: Area, Bar, Line, Donut, Bubble, Radar, RadialBar, Funnel, StatusTracker
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

| Component        | Renders via `vccs`         | Notes |
| ---------------- | -------------------------- | ----- |
| `AreaChart`      | `AreaChart` + `Area`       | v2 parity |
| `BarChart`       | `BarChart` + `Bar`         | v2 parity |
| `LineChart`      | `LineChart` + `Line`       | v2 parity |
| `DonutChart`     | `PieChart` + `Pie`         | v2 parity |
| `BubbleChart`    | `ScatterChart` + `Scatter` | v2 parity |
| `RadarChart`     | `RadarChart` + `Radar`     | **new in v3** |
| `RadialBarChart` | `RadialBarChart` + `RadialBar` | **new in v3** |
| `FunnelChart`    | `FunnelChart` + `Funnel`   | **new in v3** |
| `StatusTrackerChart` | Native responsive bars | **new in v3** |

### New cross-cutting props (cartesian charts)

- `yAxes` — plot series with different units on independent y-axes.
- `referenceLines` — draw horizontal / vertical reference lines across the plot.
- `syncId` — synchronise tooltip / hover across charts that share the same id.

#### Multiple y-axes

Give a category a `yAxis` id and describe that axis in `yAxes`. Series sharing
an id share a scale; series without one stay on the primary axis, so existing
charts are unaffected.

```vue
<script setup lang="ts">
const categories = {
  indoor: { name: "Indoor", color: "#2662d9", yAxis: "temp" },
  outdoor: { name: "Outdoor", color: "#e23670", yAxis: "temp" },
  humidity: { name: "Humidity", color: "#af57db", yAxis: "pct" },
};

const yAxes = {
  temp: { orientation: "left", label: "°C" },
  pct: { orientation: "right", label: "%", domain: [0, 100] },
};
</script>

<template>
  <LineChart :data="data" :categories="categories" :y-axes="yAxes" :height="320" x-axis="time" />
</template>
```

Each axis accepts `orientation`, `label`, `domain`, `numTicks`, `formatter`,
`hide`, and the usual `AxisConfig` tick options; anything unset falls back to
the top-level `yLabel` / `yDomain` / `yAxisConfig` props. Supported on
`LineChart`, `AreaChart` and `BarChart` (vertical orientation).
- Revived from v2: `xExplicitTicks` / `yExplicitTicks` (→ axis `ticks`),
  `minMaxTicksOnly` (→ `interval="preserveStartEnd"`), and `AxisConfig` tick text
  colour / size / alignment now apply.

### Deferred / removed

- **`SankeyChart`** — deferred: the published `vccs` release does not yet export
  a Sankey chart. Returns once `vccs` ships it.
- **`DualChart`** — planned for v3.1 (maps onto the `vccs` `ComposedChart`).
- **`GanttChart`, `DagreGraph`, `Maps`** — removed in v3. They were Unovis /
  d3-geo specific and have no `vccs` equivalent.

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
  `DonutChartProps`, `RadarChartProps`, `RadialBarChartProps`, `FunnelChartProps`,
  `StatusTrackerChartProps`, `StatusTrackerDatum`, `BulletLegendItemInterface`,
  `AxisConfig`, `TooltipConfig`, `ValueLabel`, `ReferenceLineConfig`

## Migrating from v2

The API is intentionally close to v2. Notes:

- `BarChart` keeps `:yAxis` (value keys) and `:xAxis` (category key).
- Most v2 props carry over. `xExplicitTicks` / `yExplicitTicks`, `minMaxTicksOnly`
  and the `AxisConfig` tick-text props are now honoured (they map onto `vccs`
  axis features).
- A few genuinely Unovis-only props (`crosshairConfig`, `markerConfig`,
  `lineDashArray`, `tickTextFitMode` / trim / word-break, `stackAndGrouped`) are
  accepted but inert — marked `@deprecated`, no effect, so old templates keep
  type-checking.
- `legendStyle` as a raw CSS string is ignored; pass an object instead.

## License

MIT
