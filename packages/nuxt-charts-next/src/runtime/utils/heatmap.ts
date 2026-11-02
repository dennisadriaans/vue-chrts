import { toFiniteNumber } from "./data";

export type HeatmapKey = string | number;

/** One resolved cell of the heatmap grid. */
export interface HeatmapCell<T> {
  x: HeatmapKey;
  y: HeatmapKey;
  /** Row-major position, used for keyboard navigation. */
  index: number;
  /** `undefined` when no row supplied a finite value for this cell. */
  value: number | undefined;
  /** Colour bin, `-1` for an empty cell. */
  bin: number;
  /** The source row, when one exists. */
  datum: T | undefined;
}

export interface HeatmapGrid<T> {
  columns: HeatmapKey[];
  rows: HeatmapKey[];
  cells: HeatmapCell<T>[];
  thresholds: number[];
}

export interface HeatmapGridOptions<T> {
  xKey: keyof T;
  yKey: keyof T;
  valueKey: keyof T;
  xOrder?: readonly HeatmapKey[];
  yOrder?: readonly HeatmapKey[];
  steps: number;
  scale: "linear" | "quantile";
}

function isKey(value: unknown): value is HeatmapKey {
  return typeof value === "string" || (typeof value === "number" && Number.isFinite(value));
}

/** Distinct keys in first-seen order, or the caller's order when given. */
function orderedKeys<T>(data: readonly T[], key: keyof T, order?: readonly HeatmapKey[]): HeatmapKey[] {
  if (order?.length) return [...order];
  const seen = new Set<HeatmapKey>();
  for (const row of data) {
    const value = row[key];
    if (isKey(value)) seen.add(value);
  }
  return [...seen];
}

/** Linear-interpolated quantile of an ascending list. */
function quantile(sorted: readonly number[], fraction: number): number {
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const low = sorted[lower] ?? 0;
  const high = sorted[lower + 1] ?? low;
  return low + (high - low) * (position - lower);
}

/**
 * Boundaries that split `values` into `steps` colour bins.
 *
 * `linear` cuts the range into equal widths; `quantile` puts about as many
 * cells in each bin, so skewed data (one busy hour) keeps a readable spread.
 */
export function heatmapThresholds(values: readonly number[], steps: number, scale: "linear" | "quantile"): number[] {
  const sorted = values.filter(Number.isFinite).toSorted((a, b) => a - b);
  const count = Math.max(1, Math.floor(steps));
  const fractions = Array.from({ length: count - 1 }, (_, index) => (index + 1) / count);
  if (!sorted.length) return fractions.map(() => 0);
  if (scale === "quantile") return fractions.map((fraction) => quantile(sorted, fraction));
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  return fractions.map((fraction) => min + (max - min) * fraction);
}

/** Index of the bin `value` falls in, given boundaries from {@link heatmapThresholds}. */
export function heatmapBin(value: number, thresholds: readonly number[]): number {
  return thresholds.filter((threshold) => value > threshold).length;
}

/**
 * Pivot long-format rows (`{ day, hour, value }`) into a dense row-major grid.
 *
 * Duplicate x/y pairs are summed; pairs with no row become empty cells rather
 * than zeros, so "no data" and "zero" stay distinguishable.
 */
export function buildHeatmapGrid<T>(data: readonly T[], options: HeatmapGridOptions<T>): HeatmapGrid<T> {
  const columns = orderedKeys(data, options.xKey, options.xOrder);
  const rows = orderedKeys(data, options.yKey, options.yOrder);
  const lookup = new Map<string, { value: number; datum: T }>();

  for (const datum of data) {
    const x = datum[options.xKey];
    const y = datum[options.yKey];
    const value = toFiniteNumber(datum[options.valueKey]);
    if (!isKey(x) || !isKey(y) || value === undefined) continue;
    const id = `${String(y)}\u0000${String(x)}`;
    const existing = lookup.get(id);
    lookup.set(id, { value: (existing?.value ?? 0) + value, datum: existing?.datum ?? datum });
  }

  const values = [...lookup.values()].map((entry) => entry.value);
  const thresholds = heatmapThresholds(values, options.steps, options.scale);
  const cells = rows.flatMap((y, rowIndex) =>
    columns.map((x, columnIndex) => {
      const entry = lookup.get(`${String(y)}\u0000${String(x)}`);
      return {
        x,
        y,
        index: rowIndex * columns.length + columnIndex,
        value: entry?.value,
        bin: entry ? heatmapBin(entry.value, thresholds) : -1,
        datum: entry?.datum,
      };
    }),
  );

  return { columns, rows, cells, thresholds };
}

/** The colour for each bin, mixed from `low` to `high` in equal steps. */
export function heatmapPalette(steps: number, low: string, high: string): string[] {
  const count = Math.max(1, Math.floor(steps));
  return Array.from({ length: count }, (_, index) => {
    const strength = count === 1 ? 100 : Math.round(15 + (85 * index) / (count - 1));
    return `color-mix(in oklab, ${high} ${strength}%, ${low})`;
  });
}
