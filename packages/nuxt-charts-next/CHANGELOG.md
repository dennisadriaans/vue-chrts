# Changelog

## 3.0.0-beta.2

### Added

- **Multiple y-axes** for cartesian charts (`LineChart`, `AreaChart`, `BarChart`).
  Give a category a `yAxis` id and describe each axis in the new `yAxes` prop to
  plot series with different units on independent scales (#134).

### Fixed

- Production-readiness regressions for the site release: `BubbleChart` now
  accepts v2 function accessors, the module resolves `vue-chrts` types under
  pnpm isolation, and Sparkline / Stat Tile docs render again (#138).
- `@unovis/ts` / `@unovis/vue` bumped to `^1.6.7` in the legacy `vue-chrts`
  package (#137).

## 3.0.0-beta.1

### Major

- **Engine swap:** Unovis / `vue-chrts` → [vccs](https://vue-charts.com) (Recharts-style Vue port). The Nuxt module is now standalone — no Unovis peer dependencies.
- Package formerly published as experimental `nuxt-charts-next` is now **`nuxt-charts@3`**.

### Added

- `RadarChart`, `RadialBarChart`, `FunnelChart`, `CandlestickChart`, `StatusTrackerChart`
- Area dither fills, bar cube shapes, richer theming tokens
- `referenceLines`, `syncId`, explicit tick helpers

### Removed (vs v2)

- `GanttChart`, `DagreGraph`, `TopoJSONMap`, `DottedMap` (no vccs equivalent yet)
- `DualChart` (planned v3.1), `SankeyChart` (deferred)

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
