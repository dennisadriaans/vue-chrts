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
  /** Resolved colour. Falls back to `var(--chart-color-N)` for CSS-var theming. */
  color: string;
  /** Whether the series is hidden. */
  hidden: boolean;
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
  }));
}
