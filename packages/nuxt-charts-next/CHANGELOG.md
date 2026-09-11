# Changelog

## [3.0.0](https://github.com/dennisadriaans/vue-chrts/compare/nuxt-charts@3.0.0-beta.4...nuxt-charts@3.0.0) (2026-09-11)

### Features

* **nuxt-charts:** integrate Nuxt UI theme tokens ([fbcb9e8](https://github.com/dennisadriaans/vue-chrts/commit/fbcb9e8573b4ce10ada723fb045fb265815b2c8d))

## [3.0.0-beta.4](https://github.com/dennisadriaans/vue-chrts/compare/nuxt-charts@3.0.0-beta.3...nuxt-charts@3.0.0-beta.4) (2026-09-04)

### Features

* **nuxt-charts-next:** harden chart data handling ([b7850de](https://github.com/dennisadriaans/vue-chrts/commit/b7850de0e6d77d5d3e88a8b3017a2c63a89a473b))

## [3.0.0-beta.3](https://github.com/dennisadriaans/vue-chrts/compare/nuxt-charts@3.0.0-beta.2...nuxt-charts@3.0.0-beta.3) (2026-09-03)

### Features

* **nuxt-charts-next:** bubble chart loading skeleton, grid controls and cleanup ([2d7e135](https://github.com/dennisadriaans/vue-chrts/commit/2d7e1357cb21c0f83540f742322b739ec8b88d6b))
* **nuxt-charts-next:** add style variants for fills, strokes, dots and chrome ([#148](https://github.com/dennisadriaans/vue-chrts/issues/148)) ([26ffe37](https://github.com/dennisadriaans/vue-chrts/commit/26ffe374165417fdcbf667b45a065d6b39212533))
* **charts:** auto-fit funnel labels and expose theme tokens ([9139f61](https://github.com/dennisadriaans/vue-chrts/commit/9139f619d7359d83e216b9eb0f860a05c8699c2f))
* **charts:** keep polar charts centred when a legend is present ([2c10946](https://github.com/dennisadriaans/vue-chrts/commit/2c10946dd6754cff389b77cc45fc265bd99025d1))
* **charts:** add a tooltip slot on cartesian charts ([af43308](https://github.com/dennisadriaans/vue-chrts/commit/af4330809ab9561bb05ac2310d87934b9bc76b1c))
* **charts:** space category ticks evenly for xNumTicks ([4bfb15b](https://github.com/dennisadriaans/vue-chrts/commit/4bfb15b13903d9380e04d9e8bc66ab730b74c54d))

### Bug Fixes

* **charts:** honour --vc-legend-inset on the status tracker legend ([0f6d711](https://github.com/dennisadriaans/vue-chrts/commit/0f6d71134bc1818476ab5fa30217f503d5f33e50))
* **charts:** make bubble tooltips and hover target a single series ([ca528d3](https://github.com/dennisadriaans/vue-chrts/commit/ca528d36d8edfe8c19fce6bb744a618ee5f351e6))

## [3.0.0-beta.2](https://github.com/dennisadriaans/vue-chrts/compare/nuxt-charts@3.0.0-beta.1...nuxt-charts@3.0.0-beta.2) (2026-08-28)

### Bug Fixes

* **test:** use type-only import for VueWrapper ([bbf2c5c](https://github.com/dennisadriaans/vue-chrts/commit/bbf2c5c755da8fbd1ea4d8f51ec024816a57c900))

## [3.0.0-beta.1](https://github.com/dennisadriaans/vue-chrts/compare/nuxt-charts@3.0.0-beta.0...nuxt-charts@3.0.0-beta.1) (2026-08-14)

### Bug Fixes

* support Nuxt UI/shadcn-vue color tokens, avoid custom-container remount loop ([f3051a6](https://github.com/dennisadriaans/vue-chrts/commit/f3051a604d039c913568bfc24bec0b47daf3b78d))

## [3.0.0-beta.0](https://github.com/dennisadriaans/vue-chrts/compare/v2.2.0...nuxt-charts@3.0.0-beta.0) (2026-08-14)

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
