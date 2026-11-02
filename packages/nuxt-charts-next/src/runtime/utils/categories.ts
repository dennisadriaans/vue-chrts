import { chartsConfig } from "../config";
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
  /** Resolved colour. Falls back to the library's design-system-aware series token. */
  color: string;
  /** Whether the series is hidden. */
  hidden: boolean;
  /** Id of the y-axis this series is plotted against. */
  yAxisId: AxisId;
  /** Dash pattern for this series alone, when set on its category. */
  dashArray?: string;
}

/** Size of the default palette: `--vc-series-0` … `--vc-series-5` (= `--ui-chart-1` … `--ui-chart-6`). */
export const PALETTE_SIZE = 6;

/** How much each repeat of the palette keeps of its colour, matching Nuxt UI's `UChart`. */
const REPEAT_STRENGTH = 0.65;

/**
 * Resolve a colour the way Nuxt UI does: a theme colour name (`primary`,
 * `success`, any colour added in `ui.theme.colors`) becomes `var(--ui-<name>)`,
 * `neutral` becomes `var(--ui-bg-inverted)`, and anything else — a CSS colour
 * or `var(...)` — passes through unchanged. Without Nuxt UI, the default names
 * map onto the standalone palette tokens.
 */
export function resolveThemeColor(color: string): string;
export function resolveThemeColor(color: string | undefined): string | undefined;
export function resolveThemeColor(color: string | undefined): string | undefined {
  if (!color) return color;
  if (!chartsConfig.nuxtUi) return STANDALONE_THEME_COLORS[color] ?? color;
  if (color === "neutral") return "var(--ui-bg-inverted)";
  return chartsConfig.themeColors.includes(color) ? `var(--ui-${color})` : color;
}

/**
 * Nuxt UI's default colour names, mapped onto the standalone tokens so a
 * template written for Nuxt UI still paints sensibly without it.
 */
const STANDALONE_THEME_COLORS: Record<string, string> = {
  primary: "var(--vc-series-0)",
  secondary: "var(--vc-series-1)",
  success: "var(--vc-candle-up)",
  info: "var(--vc-series-5)",
  warning: "var(--vc-series-3)",
  error: "var(--vc-candle-down)",
  neutral: "var(--vc-axis-label-color)",
};

/**
 * Default colour of the `index`-th series. The first six are the palette
 * tokens; later series repeat the palette mixed toward the surface, one step
 * lighter per repeat — unless a caller-supplied palette defines
 * `--vc-series-<index>` itself (see `themeToVars`).
 */
export function defaultSeriesColor(index: number): string {
  const slot = index % PALETTE_SIZE;
  const round = Math.floor(index / PALETTE_SIZE);
  const base = `var(--vc-series-${slot})`;
  if (round === 0) return base;
  const strength = Math.round(100 * REPEAT_STRENGTH ** round);
  return `var(--vc-series-${index}, color-mix(in oklab, ${base} ${strength}%, var(--vc-surface-bg)))`;
}

/**
 * Normalise a `BulletLegendItemInterface` colour into a single colour string,
 * falling back to the palette (see {@link defaultSeriesColor}).
 */
function resolveColor(color: BulletLegendItemInterface["color"], index: number): string {
  const own = Array.isArray(color) ? color[0] : color;
  return resolveThemeColor(own) ?? defaultSeriesColor(index);
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
    dashArray: item.dashArray,
  }));
}
