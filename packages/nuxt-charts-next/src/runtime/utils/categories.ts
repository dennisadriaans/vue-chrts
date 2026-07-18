import type { AxisId, BulletLegendItemInterface } from "../types/shared";

/** Id of the implicit primary y-axis, matching the `vccs` default. */
export const PRIMARY_Y_AXIS_ID = 0;

/**
 * Canonicalise an axis id to the form `vccs` will match on.
 *
 * `vccs` binds a series to its axis with strict equality (`item.yAxisId === axisId`),
 * so `"1"` and `1` are two different axes as far as the engine is concerned. Object
 * keys are always strings, which means a numeric id declared in `yAxes` would never
 * match the same id written as a number on a category. Ids that look like integers
 * are normalised to numbers so both spellings — including `yAxis: "0"` for the
 * primary axis — land on one axis.
 */
export function normalizeAxisId(id: AxisId): AxisId {
  if (typeof id === "number") return id;
  return /^-?\d+$/.test(id) ? Number(id) : id;
}

/**
 * A single resolved series, derived from one entry in a `categories` record.
 * Drives one `<Area>` / `<Bar>` / `<Line>` / `<Scatter>` child in the adapters.
 */
export interface SeriesDescriptor {
  /** The data property this series plots (the `categories` record key). */
  dataKey: string;
  /** Display name shown in legend / tooltip. */
  name: string;
  /** Resolved colour. Falls back to `var(--chart-color-N)` for CSS-var theming. */
  color: string;
  /** Whether the series is hidden. */
  hidden: boolean;
  /** Id of the y-axis this series is plotted against. */
  yAxisId: AxisId;
}

/**
 * Normalise a `BulletLegendItemInterface` colour into a single colour string.
 * Falls back to `var(--chart-color-N)` so callers can theme all charts via CSS.
 */
function resolveColor(color: BulletLegendItemInterface["color"], index: number): string {
  if (Array.isArray(color)) return color[0] ?? `var(--chart-color-${index})`;
  return color ?? `var(--chart-color-${index})`;
}

/**
 * Convert a `categories` record into an ordered list of {@link SeriesDescriptor}s.
 * Hidden categories are kept (so the legend can still show them) — callers that
 * want only visible series can filter on `hidden`.
 */
export function categoriesToSeries(
  categories: Record<string, BulletLegendItemInterface>,
): SeriesDescriptor[] {
  return Object.entries(categories).map(([dataKey, item], index) => ({
    dataKey,
    name: String(item.name ?? dataKey),
    color: resolveColor(item.color, index),
    hidden: item.hidden ?? false,
    yAxisId: item.yAxis == null ? PRIMARY_Y_AXIS_ID : normalizeAxisId(item.yAxis),
  }));
}
