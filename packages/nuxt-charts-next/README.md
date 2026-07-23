# nuxt-charts

Beautiful chart components for Nuxt — Area, Bar, Line, Donut, Bubble, Radar, Radial Bar, Funnel, Candlestick and Status Tracker.

Powered by [vccs](https://vue-charts.com) (Vue port of Recharts). Drop-in config-prop API from nuxt-charts v2.

## Install

```bash
# beta (v3)
pnpm add nuxt-charts@beta
```

```ts
export default defineNuxtConfig({
  modules: ["nuxt-charts"],
})
```

## Charts

| Component | Notes |
|---|---|
| `AreaChart` | Gradients, dither fills, stacked |
| `BarChart` | Grouped, stacked, horizontal, cube bars |
| `LineChart` | Multi-series, curve types |
| `DonutChart` | Center slot for labels |
| `BubbleChart` | Scatter with size encoding |
| `RadarChart` | New in v3 |
| `RadialBarChart` | New in v3 |
| `FunnelChart` | New in v3 |
| `CandlestickChart` | New in v3 |
| `StatusTrackerChart` | New in v3 |

### New cross-cutting props (cartesian charts)

- `yAxes` — plot series with different units on independent y-axes.
- `referenceLines` — draw horizontal / vertical reference lines across the plot.
- `syncId` — synchronise tooltip / hover across charts that share the same id.
- Revived from v2: `xExplicitTicks` / `yExplicitTicks` (→ axis `ticks`),
  `minMaxTicksOnly` (→ `interval="preserveStartEnd"`), and `AxisConfig` tick text
  colour / size / alignment now apply.

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
})
```

## Auto-imported enums & types

- Enums: `CurveType`, `LegendPosition`, `Orientation`, `DonutType`
- Types: `AreaChartProps`, `BarChartProps`, `LineChartProps`, `BubbleChartProps`,
  `DonutChartProps`, `RadarChartProps`, `RadialBarChartProps`, `FunnelChartProps`,
  `StatusTrackerChartProps`, `StatusTrackerDatum`, `BulletLegendItemInterface`,
  `AxisConfig`, `TooltipConfig`, `ValueLabel`, `ReferenceLineConfig`

## Migrating from v2

See the [Upgrade to v3](https://nuxtcharts.com/docs/getting-started/upgrade-to-v3) guide. Specialty charts (maps, gantt, dual, sankey, dagre) are not in v3 yet — stay on `nuxt-charts@2` if you need them.

## License

MIT
