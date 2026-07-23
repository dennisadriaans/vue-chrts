# Changelog

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
