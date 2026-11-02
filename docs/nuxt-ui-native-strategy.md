# nuxt-charts × Nuxt UI: native styling strategy

Status: implemented on `feat/nuxt-ui-native-theming` (nuxt-charts v3 / `packages/nuxt-charts-next`).

## What Nuxt UI shipped

Nuxt UI 4.12.0 (PR nuxt/ui#7022, Oct 2026) added one component, `UChart`
(`type: 'line' | 'area' | 'bar' | 'donut'`), on `@tanstack/charts` 1.x, an
optional peer dependency. It replaced Unovis in the Nuxt UI dashboard template.

How it is styled. This is the part that matters for us:

| Layer | Mechanism |
| --- | --- |
| Chrome (wrapper, tooltip, center slot) | tailwind-variants theme `#build/ui/chart` with slots `root`, `base`, `tooltip`, `tooltipTitle`, `tooltipRow`, `tooltipIndicator`, `tooltipLabel`, `tooltipValue`, `center`; overridable by `app.config.ui.chart` and the `ui` / `class` props |
| Tooltip | a real `UTooltip`, so it inherits the tooltip theme |
| Series colours | `--ui-chart-1` … `--ui-chart-6` (new tokens in Nuxt UI's `@layer theme`, light + `.dark`); `colors` / `category.color` accept theme names (`primary` → `var(--ui-primary)`, `neutral` → `var(--ui-bg-inverted)`) or CSS; series past six repeat via `color-mix(... 65%^n, var(--ui-bg))` |
| Engine paint | Nuxt UI writes `--ts-chart-N` (TanStack's own palette variables) inline on the root and sets `--ts-chart-tooltip-*` from `--ui-*` in the `root` slot; axes and grid use `currentColor` from `text-muted` |
| Escape hatch | `definition` accepts a full TanStack chart definition |

So "the TanStack strategy" is not about TanStack itself. It is a split: the
engine paints the SVG from CSS variables, Nuxt UI owns the chrome through a
component theme, and Nuxt UI tokens feed both.

## Why Unovis (and our 3.1 styling) conflicted

- Styling went through global stylesheets and CSS variables (`--vis-*`, then
  our `--chart-color-*` / `--vc-*`). There was no `ui` prop, no `class` merge,
  and no `app.config` theme.
- The chart CSS was injected *after* the host's Tailwind, so its layer outranked
  utilities, and a `class`/`ui` override could lose.
- The default series colours were Nuxt UI's *semantic* colours (`error` was
  series 6), not a chart palette.
- `MetricChart` shipped BEM classes with no stylesheet behind them.

## Decision: keep vccs, adopt Nuxt UI's styling contract

Options weighed:

1. **Move the engine to TanStack Charts** and offer our charts as `UChart`
   definitions. `UChart` covers 4 chart types. We ship 14 (funnel, sankey,
   candlestick, radar, radial, status tracker, maps, dither/pattern variants)
   on vccs. A port would mean writing custom TanStack marks for most of them,
   and the styling problem would remain, because it is engine-independent.
   Rejected for now.
2. **Contribute the charts upstream into Nuxt UI.** Nuxt UI has committed to
   TanStack. A vccs-based component would not be accepted as `UChart`, and
   `definition` only takes TanStack definitions, so we cannot plug in there.
3. **Make nuxt-charts a Nuxt UI-native citizen next to `UChart`.** Use the same
   theming contract, tokens, slot names and config path, while vccs keeps
   painting from CSS variables, exactly as TanStack does for `UChart`.
   **Chosen.**

## What "native" means now

- **Component themes** in `src/runtime/theme/*.ts` (Nuxt UI shape), resolved
  with **Nuxt UI's own `tv`** (`#ui/utils/tv`). That brings tailwind-merge,
  replacer functions and `appConfig.ui.tv` for free. The module's plugin hands
  `tv`, `useAppConfig` and theme colour names to the runtime through
  `configureCharts` (`runtime/config.ts`). The runtime defaults to standalone,
  so `nuxt-charts/components` keeps working in Storybook, Vitest and plain Vue.
- **`ui` + `class` props** on every chart, merged per slot. Elements carry
  `data-slot`.
- **`app.config`**: `nuxtCharts.chart` (all charts) and
  `nuxtCharts.<component>`. These are in Nuxt UI's shape but under our own key,
  because Nuxt UI types `appConfig.ui` as a closed type, and extra keys would
  fail users' typecheck. **`ui.chart.slots` is inherited**, so one override
  styles `UChart` and nuxt-charts together.
- **Slot names match `UChart`** (`tooltip*`, `root`). The default classes
  reproduce `UChart` + `UTooltip`.
- **Palette = `--ui-chart-1…6`**, with theme colour names and `UChart`'s repeat
  rule; a `colors` prop identical to `UChart`'s.
- **Engine tokens** (`--vc-*`) remain the SVG paint API, the equivalent of
  `--ts-chart-*`, and resolve to `--ui-*`.
- **Layer order**: chart CSS is prepended, so `@layer vue-chrts` sits below
  Tailwind's layers and utilities always win.
- **Zero config**: the module appends our theme dir as an `@source` to Nuxt UI's
  generated `ui.css`.
- **Standalone preserved**: without `@nuxt/ui`, a stand-in `tv` applies only
  caller classes, the `vc-*` stylesheet styles the chrome, and theme colour
  names fall back to the standalone palette.

## Known gaps / follow-ups

- **Grid lines**: vccs `CartesianGrid` does not render in most cartesian demos.
  This is pre-existing and identical on `main`, while `UChart` shows a
  horizontal grid by default. Worth fixing for visual parity.
- **API aliases**: `UChart` uses `index` / `categories[]` / `legend` /
  `xLabel`; we keep the v2 API (`x-axis` / record `categories` / `hideLegend` /
  `xLabel`). Optional aliases would make swapping a `UChart` for a
  nuxt-charts chart a rename-free change.
- **Future engine option**: if TanStack Charts grows marks for our catalogue,
  the theme layer built here is engine-agnostic. Only the `--vc-*` →
  `--ts-chart-*` bridge would change.
