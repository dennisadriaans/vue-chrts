# nuxt-charts

Beautiful chart and map components for Nuxt — Area, Bar, Line, Donut, Bubble, Radar, Radial Bar, Funnel, Sankey, Candlestick, Status Tracker, Dotted Map, and TopoJSON Map.

Powered by [vccs](https://vue-charts.com) (Vue port of Recharts). Drop-in config-prop API from nuxt-charts v2.

Nuxt UI-native: with `@nuxt/ui` installed, every chart is styled the Nuxt UI
way — a tailwind-variants theme per component, a `ui` prop and `class` merged
with tailwind-merge, `app.config.ts` overrides, Nuxt UI's `--ui-chart-1…6`
palette and theme colour names (`primary`, `success`, …). The defaults match
Nuxt UI's own `UChart`, so both can sit side by side. Nuxt UI stays optional:
without it, the same components use a built-in stylesheet.

## Install

```bash
# v3
pnpm add nuxt-charts@next
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
| `HeatmapChart` | Value grid from long-format rows; server-renders, one tab stop |
| `MetricChart` | Analytics card over raw rows: headline, delta, ranges, table, CSV |
| `DottedMap` | D3 dotted geography, pins, regional filters, and country colors |
| `TopoJSONMap` | D3 choropleths, points, routes, projections, and heatmaps |

### Maps

Maps include world geometry and need no external data fetch or Unovis dependency:

```vue
<script setup lang="ts">
const pins = [{ lat: 52.3676, lng: 4.9041, label: "Amsterdam" }];
const data = {
  areas: [{ id: "NLD", value: 94 }, { id: "USA", value: 91 }],
  points: [
    { id: "ams", latitude: 52.3676, longitude: 4.9041, label: "Amsterdam" },
    { id: "nyc", latitude: 40.7128, longitude: -74.006, label: "New York" },
  ],
  links: [{ source: "ams", target: "nyc" }],
};
</script>

<template>
  <DottedMap :pins="pins" :height="360" :map-height="75" />
  <TopoJSONMap :data="data" value="value" projection="equalEarth" show-point-labels />
</template>
```

Use `topoJson`/`geoJson` for custom geography, `mapFeatureKey` to select a
TopoJSON object, and `featureId` to match area IDs to a property. The bundled
map accepts ISO alpha-2, alpha-3, and numeric country IDs. `areaColor`, point
styles, and link styles accept values or typed accessor functions. Named
projections, configured D3 projections, and projection factories are supported.

Both components render SVG during SSR, resize to their containers, and share
chart themes, tooltip/legend variants, loading/error states, and accessibility.
Drag, pinch, double-click, and keyboard zoom work by default; `zoomOnScroll`
enables wheel zoom and `showControls` adds zoom/reset buttons. Exposed methods:
`zoomIn`, `zoomOut`, `zoomTo`, `resetView`; TopoJSONMap also exposes
`fitToPoints` and `zoomToFeature`. `zoomOnClick` is opt-in.

Slots provide typed tooltips, legends, SVG overlays, and custom marks
(`pin`/`dot` or `feature`/`point`/`link`). `getMap` and `getPin` are
auto-imported for precomputation and exported from `nuxt-charts/maps`.

See [Dotted Map](https://nuxtcharts.com/docs/maps/dotted-map) and
[TopoJSON Map](https://nuxtcharts.com/docs/maps/topojson-map) for the full API.

### Heatmap

`HeatmapChart` pivots long-format rows into a grid, so the data stays the shape
an API returns it in. Rows that share an x/y pair are summed; missing pairs
render as empty cells, distinct from zero.

```vue
<HeatmapChart
  :data="visits"
  x-axis="hour"
  y-axis="day"
  value-key="visits"
  :x-label-every="3"
  :x-formatter="(hour) => `${hour}:00`"
/>
```

Values fall into `steps` colour bins (default 5) on a `quantile` scale, so one
busy hour does not wash out the rest; pass `scale="linear"` for even ranges,
`colorRange` for the end colours or `colorScale` for full control. The grid is
one tab stop: arrow keys move between cells, `Home`/`End` jump within a row and
`Enter` emits `cell-click`. It renders plain HTML, so it server-renders.

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

An axis `formatter` also formats its series' tooltip values, so each value
reads in its own units. Gridlines follow the primary axis.

### Bar + line series (preview)

> [!WARNING]
> Preview: this API may change in a minor release. Feedback welcome.

In a `BarChart`, set `type: "line"` on a category to draw it as a line over the
bars — e.g. revenue bars on the left, a conversion rate line on the right:

```ts
const categories = {
  revenue: { name: "Revenue" },
  conversion: { name: "Conversion", yAxis: "pct", type: "line" },
};

const yAxes = {
  0: { formatter: (v) => `€${v / 1000}k` },
  pct: { orientation: "right", domain: [0, 5], formatter: (v) => `${v}%` },
};
```

- Vertical orientation only; on a horizontal `BarChart` the category stays a bar.
- Lines are drawn after the bars, unstacked, with `monotone` curves and no dots.
- Bar-only options (`variant`, `stacked`, `valueLabel`, `radius`) don't apply to lines.

### Horizontal category axis width

On a horizontal `BarChart` the category y-axis defaults to a 72px slot, so long
labels wrap and can overlap. Set `categoryAxisWidth` to a pixel width, or to
`"auto"` to size the axis from its labels (as v2 did):

```vue
<BarChart
  :data="tools"
  :categories="{ users: { name: 'Users' } }"
  :y-axis="['users']"
  x-axis="name"
  orientation="horizontal"
  category-axis-width="auto"
  :height="320"
/>
```

Unset keeps the default slot, so existing charts are unchanged. The prop has no
effect on a vertical `BarChart`.

## Style variants

Every treatment below is opt-in — a chart that sets none of them renders exactly
as it did before. The playground's `/variants` page shows them side by side.

### Series fills

| Prop | Chart | Values |
|---|---|---|
| `variant` | `BarChart` | `solid` (default), `cubes`, `hatched`, `hatched-outline`, `duotone`, `duotone-reverse`, `gradient`, `stripped` |
| `variant` | `AreaChart` | `gradient`, `gradient-reverse`, `solid`, `dotted`, `lines`, `hatched` |
| `variant` | `RadarChart` | `filled` (default), `lines`, `gradient` (inside to outside), `gradient-reverse` (outside to inside) |
| `variant` | `RadialBarChart` | `full` (default), `semi` |
| `variant` | `DonutChart` | `flat` (default), `gradient` |

On `AreaChart` the fill treatments layer over the v2 `gradient` fade and yield to
`dither`, which is a texture of its own.

On `BarChart` a category can set its own `variant`, overriding the chart's for
that series:

```ts
const categories = {
  organic: { name: "Organic", color: "#2662d9", variant: "hatched-outline" },
  direct: { name: "Direct", color: "#e23670" },
} satisfies Record<string, BarCategory>;
```

### Series detail

- `strokeVariant` — `solid`, `dashed`, `animated-dashed` (line + area).
- `categories[key].dashArray` — dash one series only, such as the previous
  period next to a solid current period (line + area).
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
- **`GanttChart`, `DagreGraph`** — removed in v3. They were Unovis-specific.

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

## Outside the Nuxt runtime

This package targets Nuxt apps. Tooling that renders their components without
Nuxt, such as Storybook or Vitest, can import the charts and styles directly:

```ts
import { LineChart } from "nuxt-charts/components";
import "nuxt-charts/theme.css";
import "nuxt-charts/components.css";
```

Add `vccs`, `motion-v` and `vccs > eventemitter3` to Vite's
`optimizeDeps.include`, as the module does. Charts render in standalone styling
there; a Vue + Vite app using Nuxt UI (`@nuxt/ui/vite`) can opt into the Nuxt
UI themes the module wires up automatically:

```ts
import { tv } from "@nuxt/ui/utils/tv";
import { configureCharts } from "nuxt-charts/components";

configureCharts({ nuxtUi: true, tv, useAppConfig: () => appConfig });
```

Also add `@source "../node_modules/nuxt-charts/dist/runtime/theme";` to your
CSS so Tailwind generates the theme classes. Standalone Vue/Vite applications
should use the separate `vue-chrts` package.

## Data safety, accessibility, and limits

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

### With Nuxt UI (recommended)

Zero config. The module detects `@nuxt/ui`, resolves themes with Nuxt UI's own
`tv`, and registers its theme files as a Tailwind `@source` of Nuxt UI's
stylesheet — nothing to add to your CSS.

**Colours.** Series use Nuxt UI's chart palette, `--ui-chart-1` … `--ui-chart-6`
(the palette `UChart` uses); series past the sixth repeat it, mixed toward the
background. Recolour every chart by overriding those variables, one chart with
`colors`, one series with its category `color`. Theme colour names resolve to
Nuxt UI tokens:

```vue
<BarChart
  :data="data"
  :categories="{ desktop: { name: 'Desktop' }, mobile: { name: 'Mobile', color: 'neutral' } }"
  :colors="['primary', 'warning']"
/>
```

**Slots.** Like any Nuxt UI component, pass classes per slot with `ui` (merged
with tailwind-merge, replacer functions supported) and root classes with
`class`:

```vue
<LineChart
  :data="data"
  :categories="categories"
  class="h-72"
  :ui="{ tooltip: 'rounded-lg shadow-lg', legendLabel: 'text-default' }"
/>
```

Shared slots: `root`, `tooltip`, `tooltipTitle`, `tooltipList`, `tooltipRow`,
`tooltipIndicator`, `tooltipLabel`, `tooltipValue`, `tooltipInline`, `legend`,
`legendItem`, `legendIndicator`, `legendLabel`, `empty`, `skeleton`,
`skeletonLabel`. `StatusTrackerChart` adds `header`, `title`, `summary`,
`track`, `bar`, `labels`, `statusLegend*`; `MetricChart` adds `header`,
`title`, `description`, `value`, `delta`, `ranges`, `range`, `actions`,
`action`, `table`, …. Rendered elements carry `data-slot="<name>"`. The
tooltip slot names are the same as `UChart`'s.

**App config.** Theme-wide overrides use the Nuxt UI component-theme shape
(`slots`, `variants`, `defaultVariants`, `compoundVariants`) under
`nuxtCharts` — `chart` applies to every chart, per-component keys layer on top.
Your `ui.chart` (Nuxt UI's `UChart`) slots are inherited first, so one override
styles both chart families:

```ts
// app.config.ts
export default defineAppConfig({
  ui: {
    chart: { slots: { tooltip: 'rounded-md' } }, // UChart *and* nuxt-charts
  },
  nuxtCharts: {
    chart: { slots: { legendLabel: 'text-toned' } }, // every nuxt-charts chart
    donutChart: { slots: { root: 'mx-auto max-w-sm' } }, // one component
  },
})
```

Keys: `chart`, `areaChart`, `barChart`, `lineChart`, `donutChart`,
`bubbleChart`, `radarChart`, `radialBarChart`, `funnelChart`, `sankeyChart`,
`candlestickChart`, `statusTrackerChart`, `metricChart`, `dottedMap`,
`topoJsonMap`. Nested charts inherit their parent's `ui` (except `root`), so
`<MetricChart :ui="{ tooltip: '…' }">` reaches the chart it renders.

**SVG internals** (ticks, grid, axis titles, funnel labels) are painted by
`--vc-*` engine tokens that resolve to Nuxt UI tokens — the same split `UChart`
uses with TanStack Charts' `--ts-chart-*`. Override one with a utility on the
root: `:ui="{ root: '[--vc-grid-color:var(--ui-border-muted)]' }"`.

### Without Nuxt UI

The components use a built-in light/dark stylesheet; `ui` / `class` still
apply any classes you pass. Customize with `--vc-*` variables (`--vc-series-0`
… `--vc-series-5`, `--vc-tooltip-bg`, …) and per chart with `colors` or the
`theme` prop.

### Upgrading from 3.1

Nothing breaks; existing colour overrides keep working.

- The default palette is now `--ui-chart-1…6` (was `--ui-primary`,
  `--ui-secondary`, `--ui-success`, `--ui-info`, `--ui-warning`, `--ui-error`),
  matching `UChart`. To keep the old colours, set the legacy tokens:

  ```css
  :root {
    --chart-color-0: var(--ui-primary);
    --chart-color-1: var(--ui-secondary);
    --chart-color-2: var(--ui-success);
    --chart-color-3: var(--ui-info);
    --chart-color-4: var(--ui-warning);
    --chart-color-5: var(--ui-error);
  }
  ```

- `--chart-color-0` … `--chart-color-7` are deprecated but still win when set.
  Prefer `--ui-chart-N` (Nuxt UI) or `--vc-series-N`.
- `--vc-series-6` / `--vc-series-7` still exist and default to the palette's
  first repeat.
- `theme.colors` is deprecated in favour of the `colors` prop. It still
  overrides only the slots it lists; `colors` repeats a short palette like
  `UChart`.
- Chart CSS is now injected *before* your stylesheet so Tailwind utilities
  override it; plain unlayered CSS still wins as before.

## Auto-imported enums & types

- Enums: `CurveType`, `LegendPosition`, `Orientation`, `DonutType`
- Types: `AreaChartProps`, `BarChartProps`, `LineChartProps`, `BubbleChartProps`,
  `DonutChartProps`, `RadarChartProps`, `RadialBarChartProps`, `FunnelChartProps`,
  `CandlestickChartProps`,
  `SankeyChartProps`, `SankeyInputNode`, `SankeyInputLink`,
  `StatusTrackerChartProps`, `StatusTrackerDatum`, `BulletLegendItemInterface`,
  `AxisConfig`, `ValueLabel`, `ReferenceLineConfig`, `NumericKeys`
- Map types: `DottedMapProps`, `TopoJSONMapProps`, `MapData`, `MapArea`,
  `MapFeature`, `MapPoint`, `MapLink`, `MapPin`, `MapDot`, `MapGeometry`,
  `MapProjection`, `MapRegion`, `MapZoom`, `PrecomputedMap`
- Style variant unions: `BarVariant`, `AreaFillVariant`, `StrokeVariant`,
  `DotVariant`, `DitherVariant`, `BackgroundVariant`, `LegendIndicatorVariant`,
  `TooltipVariant`, `TooltipRoundness`, `RadarVariant`, `RadialVariant`

## Migrating from v2

See the [Upgrade to v3](https://nuxtcharts.com/docs/getting-started/upgrade-to-v3) guide. Maps now use D3 and include world geometry. Gantt, dual, and dagre charts remain deferred or removed.

## License

MIT
