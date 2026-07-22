# Cube Bar Chart + Hero Type Toggle

## Goal

Add a cube-grid bar style (stacked rounded squares with a ghost background matrix) to `nuxt-charts-next`, and wire the website hero to toggle Area/Bar with arrow-cycled style variants.

## Decisions

- Cubes live as `variant="cubes"` on existing `BarChart` (named `variant` to avoid clashing with the HTML `style` attribute).
- Supports single, grouped, and stacked series via the existing `stacked` prop.
- Prefer `vccs` `<Bar>` `#shape` + entry `background` geometry over a bespoke SVG chart.
- `#shape` is always registered (solid uses `Rectangle`, cubes use `CubeBarShape`) because `vccs` captures `slots.shape` once at Bar setup.

## Library API

### `BarChartProps` additions

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"solid" \| "cubes"` | `"solid"` | Render path switch |
| `cubeGap` | `number` | `2` | Gap between cubes (px) |
| `cubeRadius` | `number` | `2` | Corner radius per cube |
| `cubeSize` | `number` | `10` | Preferred cube edge; clamped to band width |
| `cubeEmptyColor` | `string` | translucent gray | Ghost / empty cubes |

`stacked` works with cubes: the first series draws the ghost column; each series fills its contiguous cube range from the stacked segment geometry.

### Modules

1. **`utils/cubes.ts`** (pure)
   - `valueToCubeCount(valueHeight, columnHeight, rows): number`
   - `layoutCubeColumn(input): CubeRect[]` — supports `segmentY` + `includeEmpty` for stacks
   - No Vue imports

2. **`internal/CubeBarShape.vue`**
   - Consumes bar shape slot props (`x`, `y`, `width`, `height`, `background`, `fill`)
   - Draws empty cubes (optional) + filled cubes for the segment

3. **`BarChart.vue`**
   - `variant === "solid"`: `#shape` → `Rectangle`
   - `variant === "cubes"`: `#shape` → `CubeBarShape` for every `yAxis` series

## Hero (`HeroWidget.vue`)

### Controls

- Icon toggle: Area | Bar
- Prev/next arrows cycle variants for the active type:
  - **Area:** Gradient, Bayer dither, Noise dither, Fade dither
  - **Bar:** Solid, Cubes (stacked), Cubes grouped

Switching chart type resets the variant index to `0`. BarChart remounts on variant change via `:key`.

## Testing

- Unit tests for `valueToCubeCount` and `layoutCubeColumn` (counts, clamping, gap geometry)
- Playground: cubes example on `bar.vue`

## Out of scope (v1)

- Stacked / grouped cube series
- Horizontal orientation for cubes
- Explicit row-count prop (auto-derived from height)
- Line chart in the hero toggle

## Success criteria

- Hero can switch Area ↔ Bar via icons and cycle fill/style variants with arrows
- `variant="cubes"` produces a discrete grid of rounded squares with ghost empties
- Solid bar path and existing Area dither path remain unchanged
