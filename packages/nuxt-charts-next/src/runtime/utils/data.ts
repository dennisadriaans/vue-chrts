/** Default ceiling for DOM/SVG data marks. Consumers may lower or raise it. */
export const DEFAULT_MAX_DATA_POINTS = 2_000;

/** Convert numeric API input without allowing NaN or infinity into geometry. */
export function toFiniteNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

/** Evenly retain the first/last values and representative values in between. */
export function sampleData<T>(data: readonly T[], limit = DEFAULT_MAX_DATA_POINTS): T[] {
  const size = Math.max(1, Math.floor(limit));
  if (data.length <= size) return [...data];
  if (size === 1) return [data[data.length - 1]!];
  return Array.from({ length: size }, (_, index) =>
    data[Math.round((index * (data.length - 1)) / (size - 1))]!,
  );
}

/** Keep only finite positional values. Invalid entries are gaps, never zeroes. */
export function normalizeValues(data: readonly unknown[]): number[] {
  return data.flatMap((value) => {
    const number = toFiniteNumber(value);
    return number === undefined ? [] : [number];
  });
}

export interface NamedValue<T = unknown> {
  row: T | undefined;
  name: string;
  value: number;
  sourceIndex: number;
}

/** Resolve both the v2 positional API and the v3 record-based API. */
export function normalizeNamedValues<T>(
  data: readonly number[] | readonly T[],
  categoryNames: readonly string[],
  nameKey?: keyof T,
  valueKey?: keyof T,
): NamedValue<T>[] {
  return data.flatMap((entry, sourceIndex) => {
    const recordMode = valueKey !== undefined && typeof entry === "object" && entry !== null;
    const row = recordMode ? entry as T : undefined;
    const value = toFiniteNumber(recordMode ? row![valueKey!] : entry);
    if (value === undefined) return [];
    const rawName = recordMode && nameKey !== undefined ? row![nameKey] : categoryNames[sourceIndex];
    return [{ row, value, sourceIndex, name: String(rawName ?? sourceIndex) }];
  });
}

/** Normalize selected row fields and discard rows with any invalid plotted value. */
export function normalizeNumericRows<T>(data: readonly T[], keys: readonly (keyof T)[]): T[] {
  return data.flatMap((row) => {
    const copy = { ...row } as T;
    for (const key of keys) {
      const value = toFiniteNumber(row[key]);
      if (value === undefined) return [];
      copy[key] = value as T[keyof T];
    }
    return [copy];
  });
}

const warned = new Set<string>();

export function warnDataLimit(chart: string, received: number, limit: number): void {
  if (!import.meta.dev || received <= limit || warned.has(chart)) return;
  warned.add(chart);
  console.warn(
    `[nuxt-charts] ${chart} received ${received.toLocaleString()} rows; `
    + `rendering a ${limit.toLocaleString()}-row sample. Set maxDataPoints to override.`,
  );
}
