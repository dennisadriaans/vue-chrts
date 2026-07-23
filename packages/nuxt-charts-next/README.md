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
