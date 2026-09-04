# nuxt-charts

Beautiful chart components for Nuxt — Area, Bar, Line, Donut, Bubble, Radar, Radial Bar, Funnel, Sankey, Candlestick and Status Tracker.

Powered by [vccs](https://vue-charts.com) (Vue port of Recharts). Drop-in config-prop API from nuxt-charts v2.

Nuxt UI v4 is a first-class, zero-config integration: chart series, surfaces,
text, borders, radius, typography, and dark mode inherit its semantic design
tokens. Nuxt UI is not a dependency; every token has a standalone fallback, so
the same components work in any Nuxt project.

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
| `AreaChart` | Gradients, dither fills, textured fills, stacked |
| `BarChart` | Grouped, stacked, horizontal, cube bars, patterned fills |
| `LineChart` | Multi-series, curve types, dashed / animated strokes |
| `DonutChart` | Center slot for labels |
| `BubbleChart` | Scatter with size encoding |
| `RadarChart` | New in v3 |
| `RadialBarChart` | New in v3 |
| `FunnelChart` | New in v3 |
| `SankeyChart` | New in v3 |
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

## Style variants

Every treatment below is opt-in — a chart that sets none of them renders exactly
as it did before. The playground's `/variants` page shows them side by side.

### Series fills

| Prop | Chart | Values |
|---|---|---|
| `variant` | `BarChart` | `solid` (default), `cubes`, `hatched`, `duotone`, `duotone-reverse`, `gradient`, `stripped` |
| `variant` | `AreaChart` | `gradient`, `gradient-reverse`, `solid`, `dotted`, `lines`, `hatched` |
| `variant` | `RadarChart` | `filled` (default), `lines`, `gradient` (inside to outside), `gradient-reverse` (outside to inside) |
| `variant` | `RadialBarChart` | `full` (default), `semi` |
| `variant` | `DonutChart` | `flat` (default), `gradient` |

On `AreaChart` the fill treatments layer over the v2 `gradient` fade and yield to
`dither`, which is a texture of its own.

### Series detail

- `strokeVariant` — `solid`, `dashed`, `animated-dashed` (line + area).
- `dotVariant` — `default`, `border`, `colored-border`, `ping` (line, area,
  radar), sized by `dotSize`.
- `glow` — a soft outer glow (bar, line, area, donut).
- `bufferBar` — renders the final bar as a projection: a hollow hatch with an
  outline, for a period that is still accruing.
- `hoverHighlight` / `maxHighlight` — dim every bar but the hovered one, or the
  tallest.
- `percent` — with `stacked`, normalise each category to 100% and label the
  value axis as percentages.

### Chart chrome

- `backgroundPattern` — one of eleven textures painted behind the plot area and
  faded out at the edges: `dots`, `grid`, `cross-hatch`, `diagonal-lines`,
  `plus`, `falling-triangles`, `4-pointed-star`, `tiny-checkers`,
  `overlapping-circles`, `wiggle-lines`, `bubbles`.
- `legendVariant` — `square`, `circle`, `circle-outline`, `rounded-square`
  (default), `rounded-square-outline`, `vertical-bar`, `horizontal-bar`.
- `tooltipVariant` (`default`, `frosted-glass`) and `tooltipRoundness`
  (`sm`, `md`, `lg`, `xl`).
- `loading` — a shimmering placeholder in place of the chart, with the
  silhouette matched to the chart type; `loadingLabel` names or hides its pill.
- `gridType` on `RadarChart` — `polygon` (default) or `circle`.

```vue
<template>
  <BarChart
    :data="data"
    :categories="categories"
    :y-axis="['desktop']"
    x-axis="month"
    :height="320"
    variant="duotone"
    background-pattern="dots"
    legend-variant="circle"
    tooltip-variant="frosted-glass"
    max-highlight
  />
</template>
```

The animated stroke and the loading shimmer both stop when the viewer's system
asks for reduced motion. Every generated SVG paint is scoped to its chart, so
several charts on one page never collide.

### Deferred / removed

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

## Data safety, accessibility, and limits

This package is Nuxt-only. Vue/Vite applications should use the separate
`vue-chrts` package.

All numeric chart input is validated before it reaches a scale or SVG
attribute. `null`, missing values, `NaN`, and positive/negative infinity are
treated as gaps; a chart with no valid values shows `emptyLabel` (default:
`"No valid data"`). Donut, Radial Bar, and Funnel accept record data with
`nameKey` and `valueKey`; positional numeric arrays remain supported for v2
compatibility.

Every chart accepts `ariaLabel`, `ariaDescription`, and
`accessibleDataTable`. The visually hidden table is enabled by default and is
the keyboard/screen-reader equivalent of pointer-only SVG tooltips.

SVG charts render at most 2,000 data rows by default. Larger inputs are sampled
evenly (preserving both endpoints) and emit one development warning. Override
this with `maxDataPoints`, but use pre-aggregation for genuinely dense data:
SVG creates DOM work per mark, so raising the limit can block the UI.

## Theming

With Nuxt UI, no chart-specific setup is required. Categories without an
explicit `color` use `--ui-primary`, `--ui-secondary`, `--ui-success`,
`--ui-info`, `--ui-warning`, and `--ui-error`; chart chrome follows Nuxt UI's
background, text, border, radius, and font tokens.

Without Nuxt UI, built-in light and dark defaults are used. Customize globally
with `--vc-*` variables (or the backwards-compatible `--chart-color-0` through
`--chart-color-7`), and customize one chart with the `theme` prop:

```vue
<LineChart
  :data="data"
  :categories="categories"
  :theme="{ colors: ['var(--brand)', 'var(--accent)'] }"
/>
```

## Auto-imported enums & types

- Enums: `CurveType`, `LegendPosition`, `Orientation`, `DonutType`
- Types: `AreaChartProps`, `BarChartProps`, `LineChartProps`, `BubbleChartProps`,
  `DonutChartProps`, `RadarChartProps`, `RadialBarChartProps`, `FunnelChartProps`,
  `CandlestickChartProps`,
  `SankeyChartProps`, `SankeyInputNode`, `SankeyInputLink`,
  `StatusTrackerChartProps`, `StatusTrackerDatum`, `BulletLegendItemInterface`,
  `AxisConfig`, `ValueLabel`, `ReferenceLineConfig`, `NumericKeys`
- Style variant unions: `BarVariant`, `AreaFillVariant`, `StrokeVariant`,
  `DotVariant`, `DitherVariant`, `BackgroundVariant`, `LegendIndicatorVariant`,
  `TooltipVariant`, `TooltipRoundness`, `RadarVariant`, `RadialVariant`

## Migrating from v2

See the [Upgrade to v3](https://nuxtcharts.com/docs/getting-started/upgrade-to-v3) guide. Specialty charts (maps, gantt, dual, dagre) are not in v3 yet — stay on `nuxt-charts@2` if you need them.

## License

MIT
