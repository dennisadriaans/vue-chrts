/**
 * Style variants shared across the chart adapters.
 *
 * Every variant is a *paint* — an SVG `<pattern>`, `<linearGradient>` or
 * `<filter>` emitted into a `<defs>` block and referenced by a series' `fill`
 * or `filter`. Keeping the unions and the id helpers in one module means the
 * `<defs>` component and the chart that references them can never disagree on
 * a name, which is the one failure mode that renders a series invisible.
 *
 * Ids are scoped by a `useId()` value from the owning chart so several charts
 * on one page — each with its own variant and colours — never collide.
 */

/**
 * Fill treatment for a bar series.
 *
 * - `solid` — flat series colour (the default rectangle bar).
 * - `cubes` — a stacked grid of rounded squares, see `utils/cubes`.
 * - `hatched` — diagonal stripes cut out of the series colour.
 * - `duotone` — vertical split: left half faded, right half solid.
 * - `duotone-reverse` — the same split, mirrored.
 * - `gradient` — series colour fading out toward the baseline.
 * - `stripped` — a faint body under a solid cap strip floating above the bar.
 */
export type BarVariant =
  | "solid"
  | "cubes"
  | "hatched"
  | "duotone"
  | "duotone-reverse"
  | "gradient"
  | "stripped";

/** Every bar variant, in the order a variant picker should cycle through them. */
export const BAR_VARIANTS: BarVariant[] = [
  "solid",
  "cubes",
  "hatched",
  "duotone",
  "duotone-reverse",
  "gradient",
  "stripped",
];

/** Bar variants that paint from a generated `<defs>` pattern rather than a flat colour. */
export const PATTERNED_BAR_VARIANTS: BarVariant[] = [
  "hatched",
  "duotone",
  "duotone-reverse",
  "gradient",
  "stripped",
];

/**
 * Fill treatment for an area series.
 *
 * - `gradient` — series colour fading to transparent at the baseline (default).
 * - `gradient-reverse` — the fade runs the other way, densest at the baseline.
 * - `solid` — an even, low-opacity wash with no vertical ramp.
 * - `dotted` — a fine dot texture cut out of the series colour.
 * - `lines` — a diagonal hairline texture.
 * - `hatched` — broad soft-edged diagonal bands.
 */
export type AreaFillVariant =
  | "gradient"
  | "gradient-reverse"
  | "solid"
  | "dotted"
  | "lines"
  | "hatched";

/** Every area fill variant, in the order a variant picker should cycle through them. */
export const AREA_FILL_VARIANTS: AreaFillVariant[] = [
  "gradient",
  "gradient-reverse",
  "solid",
  "dotted",
  "lines",
  "hatched",
];

/**
 * Stroke treatment for a line or area outline.
 *
 * `animated-dashed` marches the dashes along the path with an SVG `<animate>`,
 * so it needs no JavaScript frame loop and keeps running while the tab is idle.
 */
export type StrokeVariant = "solid" | "dashed" | "animated-dashed";

/** Every stroke variant, in the order a variant picker should cycle through them. */
export const STROKE_VARIANTS: StrokeVariant[] = ["solid", "dashed", "animated-dashed"];

/**
 * Point-marker treatment for a line / area / radar series.
 *
 * - `default` — a small filled dot in the series colour.
 * - `border` — a larger dot ringed in the surface colour, so it reads on top
 *   of a busy fill.
 * - `colored-border` — a surface-coloured dot ringed in the series colour.
 * - `ping` — a `default` dot under a ring that pulses outward.
 */
export type DotVariant = "default" | "border" | "colored-border" | "ping";

/** Every dot variant, in the order a variant picker should cycle through them. */
export const DOT_VARIANTS: DotVariant[] = ["default", "border", "colored-border", "ping"];

/** Shape of the colour swatch drawn beside each legend entry. */
export type LegendIndicatorVariant =
  | "square"
  | "circle"
  | "circle-outline"
  | "rounded-square"
  | "rounded-square-outline"
  | "vertical-bar"
  | "horizontal-bar";

/** Every legend indicator, in the order a variant picker should cycle through them. */
export const LEGEND_INDICATOR_VARIANTS: LegendIndicatorVariant[] = [
  "square",
  "circle",
  "circle-outline",
  "rounded-square",
  "rounded-square-outline",
  "vertical-bar",
  "horizontal-bar",
];

/**
 * Tooltip surface treatment. `frosted-glass` blurs whatever sits behind the
 * tooltip instead of painting an opaque panel over it.
 */
export type TooltipVariant = "default" | "frosted-glass";

/** Corner radius preset for the tooltip surface. */
export type TooltipRoundness = "sm" | "md" | "lg" | "xl";

/** Fill treatment for a radar polygon: a filled area, or its outline only. */
/**
 * Radar polygon treatment.
 *
 * - `filled` — flat, translucent series colour.
 * - `lines` — outline only.
 * - `gradient` — strongest at the centre and fading toward the outside.
 * - `gradient-reverse` — transparent at the centre and strongest outside.
 */
export type RadarVariant = "filled" | "lines" | "gradient" | "gradient-reverse";

/** Sweep of a radial bar chart: a full turn, or a semicircle gauge. */
export type RadialVariant = "full" | "semi";

/**
 * Strip characters an SVG id cannot carry. Series keys come from user data, so
 * a key like `"cost ($)"` would otherwise produce a `url(#…)` that never
 * resolves and a silently unpainted series.
 */
function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

/**
 * Build a deterministic id for one paint.
 *
 * `kind` names the paint (`"hatched"`, `"glow"`, …), `scope` is the owning
 * chart's `useId()` value, and `dataKey` the series. The same call in the
 * `<defs>` component and at the `fill="url(#…)"` reference site yields the
 * same string, which is what keeps the two in sync.
 */
export function variantId(kind: string, dataKey: string, scope?: string): string {
  const id = scope ? `${scope}-${dataKey}` : dataKey;
  return `nc-${sanitize(kind)}-${sanitize(id)}`;
}

/**
 * Id for a paint shared by every series of one chart, such as the background
 * pattern or a texture whose geometry carries no colour.
 */
export function scopeId(kind: string, scope: string): string {
  return `nc-${sanitize(kind)}-${sanitize(scope)}`;
}

/** SVG `stroke-dasharray` for a stroke variant, or `undefined` for a solid line. */
export function strokeDasharrayFor(variant: StrokeVariant | undefined): string | undefined {
  return variant === "dashed" || variant === "animated-dashed" ? "3 3" : undefined;
}
