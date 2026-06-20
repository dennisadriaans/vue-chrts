# Deferred adapters

## `SankeyChart.vue.txt`

Stored as `.txt` (not `.vue`) so it is **not** compiled or registered.

`vccs@0.4.0` — the latest published release — does not export a `Sankey`
component (it exists only on the upstream `main` branch). The adapter is kept
here ready for **iteration 2**: once `vccs` ships Sankey, rename this back to
`../SankeyChart.vue` and re-add:

- `SankeyChart: "SankeyChart"` to `COMPONENTS` in `src/core/components.ts`
- `SankeyChartProps`, `SankeyInputNode`, `SankeyInputLink` to the type imports
  in `src/core/imports.ts`

The public Sankey types in `src/runtime/types/charts.ts` are already in place.

## DualChart (planned for v3.1)

Not yet implemented. The old v2 `DualChart` (bar + line on a shared x-axis with a
secondary y-axis) maps onto the `vccs` `ComposedChart` (`<Bar>` + `<Line>` +
a second `<YAxis yAxisId="right">`). It is a clean port but deliberately deferred
to v3.1 so the v3 launch stays focused on parity + the polar/funnel additions.
