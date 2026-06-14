import type { BulletLegendItemInterface } from "../types/shared";

/**
 * A single resolved series, derived from one entry in a `categories` record.
 * Drives one `<Area>` / `<Bar>` / `<Line>` / `<Scatter>` child in the adapters.
 */
export interface SeriesDescriptor {
  /** The data property this series plots (the `categories` record key). */
  dataKey: string;
  /** Display name shown in legend / tooltip. */
  name: string;
  /** Resolved colour, or `undefined` to let `vccs` pick a default. */
  color: string | undefined;
  /** Whether the series is hidden. */
  hidden: boolean;
}

/**
 * Normalise a `BulletLegendItemInterface` colour (which may be a string or, for
 * v2 compatibility, an array) into a single colour string.
 */
function resolveColor(color: BulletLegendItemInterface["color"]): string | undefined {
  if (Array.isArray(color)) return color[0];
  return color;
}

/**
 * Convert a `categories` record into an ordered list of {@link SeriesDescriptor}s.
 * Hidden categories are kept (so the legend can still show them) — callers that
 * want only visible series can filter on `hidden`.
 */
export function categoriesToSeries(
  categories: Record<string, BulletLegendItemInterface>,
): SeriesDescriptor[] {
  return Object.entries(categories).map(([dataKey, item]) => ({
    dataKey,
    name: String(item.name ?? dataKey),
    color: resolveColor(item.color),
    hidden: item.hidden ?? false,
  }));
}
