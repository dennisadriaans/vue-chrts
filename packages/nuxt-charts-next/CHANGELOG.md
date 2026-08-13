# Changelog

## 3.0.0-beta.0

First public beta of nuxt-charts v3. The package published as the experimental
`nuxt-charts-next` is now **`nuxt-charts@3`**; v2 continues as `nuxt-charts-legacy`.

### Major

- **Engine swap:** Unovis / `vue-chrts` → [vccs](https://vue-charts.com) (Recharts-style Vue port). The Nuxt module is now standalone — no Unovis peer dependencies.

### Added

- `RadarChart`, `RadialBarChart`, `FunnelChart`, `CandlestickChart`, `StatusTrackerChart`
- **Multiple y-axes** for cartesian charts (`LineChart`, `AreaChart`, `BarChart`).
  Give a category a `yAxis` id and describe each axis in the new `yAxes` prop to
  plot series with different units on independent scales (#134).
- Area dither fills, bar cube shapes, richer theming tokens
- `referenceLines`, `syncId`, explicit tick helpers

### Removed (vs v2)

- `GanttChart`, `DagreGraph`, `TopoJSONMap`, `DottedMap` (no vccs equivalent yet)
- `DualChart` (planned v3.1), `SankeyChart` (deferred)

### Fixed

- `BubbleChart` accepts v2 function accessors, the module resolves `vue-chrts`
  types under pnpm isolation, and Sparkline / Stat Tile docs render again (#138).

### Migrate

```bash
pnpm add nuxt-charts@beta
```

```ts
export default defineNuxtConfig({
  modules: ["nuxt-charts"],
})
```

Most templates using Area/Bar/Line/Donut/Bubble keep working unchanged.
