import type { MarkerConfig, MarkerSeriesConfig } from "../types/shared";

/**
 * Normalise the v2 `markerConfig` (flat record, or legacy `{ id, config }`
 * wrapper) into a flat `Record<seriesKey, MarkerSeriesConfig>`.
 */
export function normalizeMarkerConfig(
  markerConfig: MarkerConfig | undefined,
): Record<string, MarkerSeriesConfig> {
  if (!markerConfig) return {};
  const wrapped = markerConfig as { config?: Record<string, MarkerSeriesConfig> };
  if (wrapped.config) return wrapped.config;
  return markerConfig as Record<string, MarkerSeriesConfig>;
}

/**
 * Resolve the `vccs` `dot` prop for one series from its marker config.
 * Returns `false` (no dot) when the series has no marker, otherwise a dot
 * options object (`r`, `fill`, `stroke`, `strokeWidth`) `vccs` understands.
 *
 * `vccs` (recharts-shaped) renders circular dots; the v2 `type` (square /
 * triangle / diamond) has no analog, so only the size / colours carry over.
 */
export function markerToDot(
  marker: MarkerSeriesConfig | undefined,
  seriesColor: string,
): false | Record<string, unknown> {
  if (!marker) return false;
  return {
    r: marker.size ? marker.size / 2 : 3,
    fill: marker.color ?? seriesColor,
    stroke: marker.strokeColor ?? marker.color ?? seriesColor,
    strokeWidth: marker.strokeWidth ?? 1,
  };
}

/**
 * Convert the v2 `lineDashArray` into an SVG `stroke-dasharray` string.
 * Accepts the v2 `number[][]` form (first pattern used) or a ready string.
 */
export function toStrokeDasharray(
  lineDashArray: number[][] | string | undefined,
): string | undefined {
  if (lineDashArray === undefined) return undefined;
  if (typeof lineDashArray === "string") return lineDashArray;
  const first = lineDashArray[0];
  return first?.length ? first.join(" ") : undefined;
}
