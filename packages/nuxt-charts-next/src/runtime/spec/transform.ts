/**
 * The transform pipeline: raw application rows -> aggregated chart rows.
 *
 * Everything here is a pure function of `(rows, spec)`. Nothing touches the
 * DOM, Vue reactivity, or the rendering layer, which is what makes the whole
 * stage testable on plain arrays and reusable outside a component (a server
 * route computing the same numbers, say).
 *
 * All date maths runs in UTC. Bucketing in local time would make the same
 * spec and the same rows produce different charts for two users in different
 * zones — and the boundary rows would silently move between buckets.
 */
import { toFiniteNumber } from "../utils/data";
import {
  COMPARE_KEY,
  VALUE_KEY,
  type ChartSpec,
  type SpecAggregate,
  type SpecDatum,
  type SpecInterval,
} from "./types";

/** Milliseconds in a day. Used for whole-day window arithmetic. */
const DAY_MS = 86_400_000;

/**
 * Parse a value into a timestamp, accepting the shapes application data
 * actually arrives in: `Date`, epoch milliseconds, or an ISO-ish string.
 *
 * Returns `undefined` rather than `NaN` so callers can treat "not a date" as
 * a category instead of having to guard every arithmetic use.
 */
export function toTimestamp(value: unknown): number | undefined {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : undefined;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || value === "") return undefined;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : undefined;
}

/**
 * Snap a timestamp down to the start of its bucket, in UTC.
 *
 * Weeks start Monday (ISO-8601), so `getUTCDay()`'s Sunday-as-0 is remapped:
 * Sunday belongs to the week that began six days earlier, not the one starting
 * the next day.
 */
export function floorToInterval(time: number, interval: SpecInterval): number {
  const date = new Date(time);
  if (interval === "month") {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
  }
  const midnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  if (interval === "day") return midnight;
  const dayOfWeek = (new Date(midnight).getUTCDay() + 6) % 7;
  return midnight - dayOfWeek * DAY_MS;
}

/** Step one bucket forward. Months step calendar-wise, not by a fixed 30 days. */
export function nextBucket(time: number, interval: SpecInterval): number {
  if (interval === "month") {
    const date = new Date(time);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
  }
  return time + (interval === "week" ? 7 * DAY_MS : DAY_MS);
}

/**
 * Canonical key for a bucket: the ISO date of its first day (`2026-03-01`).
 *
 * A sortable, stable string rather than a formatted label, because it doubles
 * as the grouping key and as the join key that aligns a comparison series with
 * the current one. Display formatting happens later, at the axis.
 */
export function bucketKey(time: number, interval: SpecInterval): string {
  return new Date(floorToInterval(time, interval)).toISOString().slice(0, 10);
}

/** Collapse a list of numbers per the requested aggregate. */
export function aggregateValues(values: readonly number[], aggregate: SpecAggregate): number {
  if (aggregate === "count") return values.length;
  if (values.length === 0) return 0;
  switch (aggregate) {
    case "average":
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    default:
      return values.reduce((sum, value) => sum + value, 0);
  }
}

/** Read a field off a row without assuming the row is a well-typed record. */
function fieldOf(row: unknown, field: string): unknown {
  return (row as Record<string, unknown> | null)?.[field];
}

/**
 * Group rows by x bucket, then aggregate each group.
 *
 * `count` keeps rows whose y value is missing or non-numeric — it is counting
 * rows, and discarding those would undercount. Every other aggregate drops
 * them, since a row with no measurable value cannot contribute to a sum.
 */
function aggregateRows<T>(
  rows: readonly T[],
  xField: string,
  yField: string | undefined,
  aggregate: SpecAggregate,
  interval: SpecInterval | undefined,
): Map<string, number> {
  const groups = new Map<string, number[]>();

  for (const row of rows) {
    const rawX = fieldOf(row, xField);
    if (rawX === null || rawX === undefined || rawX === "") continue;

    let key: string;
    if (interval) {
      const time = toTimestamp(rawX);
      if (time === undefined) continue;
      key = bucketKey(time, interval);
    }
    else {
      key = String(rawX);
    }

    const value = yField === undefined ? undefined : toFiniteNumber(fieldOf(row, yField));
    if (aggregate !== "count" && value === undefined) continue;

    const bucket = groups.get(key) ?? [];
    bucket.push(value ?? 0);
    groups.set(key, bucket);
  }

  return new Map(
    [...groups].map(([key, values]) => [key, aggregateValues(values, aggregate)]),
  );
}

/**
 * Every bucket key in `[from, to]`, so a series can show its empty buckets.
 *
 * Bounded to keep a malformed range (or a `day` interval over a decade) from
 * generating an unusable number of points; the cap is generous enough that
 * real ranges never reach it.
 */
const MAX_FILLED_BUCKETS = 5_000;

function bucketRange(from: number, to: number, interval: SpecInterval): string[] {
  const keys: string[] = [];
  let cursor = floorToInterval(from, interval);
  while (cursor <= to && keys.length < MAX_FILLED_BUCKETS) {
    keys.push(bucketKey(cursor, interval));
    cursor = nextBucket(cursor, interval);
  }
  return keys;
}

/**
 * The baseline bucket for each current bucket, in the same order.
 *
 * `previous-period` steps back by however many buckets the window spans, so a
 * three-month window compares against the three months before it. That keeps
 * the two lists the same length, which is what makes the index-wise pairing
 * below sound — a day-length shift could floor into an extra leading bucket
 * and offset every pair by one.
 *
 * `previous-year` steps back one calendar year per bucket instead, so March
 * lines up with March regardless of how many days sit between them.
 */
function compareBucketKeys(
  currentKeys: readonly string[],
  interval: SpecInterval,
  compare: NonNullable<ChartSpec["compare"]>,
): string[] {
  if (compare === "previous-year") {
    return currentKeys.map((key) => {
      const date = new Date(Date.parse(key));
      return bucketKey(
        Date.UTC(date.getUTCFullYear() - 1, date.getUTCMonth(), date.getUTCDate()),
        interval,
      );
    });
  }
  // Walk back `length` buckets from the first current bucket, then step
  // forward through the same number of buckets.
  let cursor = Date.parse(currentKeys[0] ?? "");
  if (!Number.isFinite(cursor)) return [];
  const back: number[] = [];
  for (let i = 0; i < currentKeys.length; i += 1) {
    cursor = previousBucket(cursor, interval);
    back.unshift(cursor);
  }
  return back.map((time) => bucketKey(time, interval));
}

/** Step one bucket backwards. Mirrors {@link nextBucket}. */
export function previousBucket(time: number, interval: SpecInterval): number {
  if (interval === "month") {
    const date = new Date(time);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1);
  }
  return time - (interval === "week" ? 7 * DAY_MS : DAY_MS);
}

/** The window a spec's `range` describes, as a `[from, to]` timestamp pair. */
function resolveRange(spec: ChartSpec): [number, number] | undefined {
  if (!spec.range) return undefined;
  const from = toTimestamp(spec.range.from);
  const to = toTimestamp(spec.range.to);
  if (from === undefined || to === undefined || from > to) return undefined;
  return [from, to];
}

/** Rows whose x value falls inside the window. */
function rowsInWindow<T>(
  rows: readonly T[],
  xField: string,
  [from, to]: [number, number],
): T[] {
  return rows.filter((row) => {
    const time = toTimestamp(fieldOf(row, xField));
    return time !== undefined && time >= from && time <= to;
  });
}

/** Result of running a spec over rows: the chart data plus what it summarises. */
export interface TransformResult {
  /** Aggregated rows, one per x bucket, ready to hand to a chart component. */
  data: SpecDatum[];
  /** Series keys present in `data`, in render order. */
  series: string[];
  /** Total of the primary series over the window. */
  total: number;
  /** Total of the comparison series, when the spec asked for one. */
  compareTotal?: number;
  /**
   * Fractional change from `compareTotal` to `total` (`0.124` = up 12.4%).
   *
   * `undefined` when there is no comparison, and when the baseline is zero —
   * growth from nothing has no meaningful percentage, and reporting `Infinity`
   * or a bare `100%` would both be lies.
   */
  change?: number;
}

/**
 * Run a spec over rows and return the aggregated chart data.
 *
 * The single entry point for the data layer. Its output is deliberately plain:
 * an array of flat records plus the series keys that index them, which is the
 * exact shape the existing chart adapters already consume.
 */
export function transform<T>(rows: readonly T[], spec: ChartSpec): TransformResult {
  const { x: xField, y: yField, series: seriesField } = spec.dimensions;
  const aggregate = spec.transform?.aggregate ?? "sum";
  const interval = spec.transform?.interval;
  const fillGaps = spec.transform?.fillGaps ?? true;
  const range = resolveRange(spec);

  // A `series` split and a `compare` both claim the series dimension. Rather
  // than silently rendering one of them, the split wins (it is the more
  // specific request) and the comparison is dropped.
  const compare = seriesField ? undefined : spec.compare;

  const windowed = range ? rowsInWindow(rows, xField, range) : [...rows];

  /** Groups of rows to aggregate independently, keyed by the series they become. */
  const partitions = new Map<string, T[]>();

  if (seriesField) {
    for (const row of windowed) {
      const raw = fieldOf(row, seriesField);
      const key = raw === null || raw === undefined || raw === "" ? "unknown" : String(raw);
      const bucket = partitions.get(key) ?? [];
      bucket.push(row);
      partitions.set(key, bucket);
    }
  }
  else {
    partitions.set(VALUE_KEY, windowed);
  }

  const aggregated = new Map<string, Map<string, number>>();
  for (const [key, partitionRows] of partitions) {
    aggregated.set(key, aggregateRows(partitionRows, xField, yField, aggregate, interval));
  }

  /**
   * The comparison series is aggregated over the shifted window but re-keyed
   * onto the current window's buckets, so bucket N of the baseline lines up
   * with bucket N of the current period on a shared x axis.
   */
  let compareByKey: Map<string, number> | undefined;
  if (compare && range && interval) {
    const currentKeys = bucketRange(range[0], range[1], interval);
    // Align on buckets, not on raw day arithmetic. Shifting the window by its
    // own length in days can land mid-bucket, which makes the shifted range
    // floor to an extra leading bucket and pairs every bucket with the wrong
    // baseline. Stepping back one bucket per current bucket keeps the two
    // lists the same length and the same shape by construction.
    const shiftedKeys = compareBucketKeys(currentKeys, interval, compare);
    const span = shiftedKeys.length
      ? [Date.parse(shiftedKeys[0]!), nextBucket(Date.parse(shiftedKeys.at(-1)!), interval) - 1] as const
      : undefined;
    const compareRows = span ? rowsInWindow(rows, xField, [span[0], span[1]]) : [];
    const raw = aggregateRows(compareRows, xField, yField, aggregate, interval);
    compareByKey = new Map();
    currentKeys.forEach((key, index) => {
      const source = shiftedKeys[index];
      if (source !== undefined) compareByKey!.set(key, raw.get(source) ?? 0);
    });
  }

  // The union of every partition's keys, so a bucket present in one series but
  // not another still produces a row (with that series left undefined).
  const keys = new Set<string>();
  if (interval && fillGaps && range) {
    for (const key of bucketRange(range[0], range[1], interval)) keys.add(key);
  }
  for (const buckets of aggregated.values()) {
    for (const key of buckets.keys()) keys.add(key);
  }

  const seriesKeys = [...aggregated.keys()];
  let ordered = [...keys];

  const sort = spec.transform?.sort ?? (interval ? "asc" : "none");
  if (sort !== "none") {
    // Temporal keys are ISO dates, so lexicographic order is chronological.
    // Categorical keys are sorted by their total instead, which is what
    // "sort a bar chart" almost always means.
    const totalFor = (key: string) =>
      seriesKeys.reduce((sum, series) => sum + (aggregated.get(series)?.get(key) ?? 0), 0);
    ordered = interval
      ? ordered.sort((a, b) => (sort === "asc" ? a.localeCompare(b) : b.localeCompare(a)))
      : ordered.sort((a, b) => (sort === "asc" ? totalFor(a) - totalFor(b) : totalFor(b) - totalFor(a)));
  }

  if (spec.transform?.limit !== undefined && spec.transform.limit > 0) {
    ordered = ordered.slice(0, Math.floor(spec.transform.limit));
  }

  const data: SpecDatum[] = ordered.map((key) => {
    const datum: SpecDatum = { x: key };
    for (const series of seriesKeys) {
      const value = aggregated.get(series)?.get(key);
      // `fillGaps` decides whether a missing bucket is a zero or a hole.
      datum[series] = value ?? (interval && fillGaps ? 0 : undefined);
    }
    if (compareByKey) datum[COMPARE_KEY] = compareByKey.get(key) ?? 0;
    return datum;
  });

  const sumOf = (series: string) =>
    data.reduce((sum, datum) => sum + (toFiniteNumber(datum[series]) ?? 0), 0);

  const total = seriesKeys.reduce((sum, series) => sum + sumOf(series), 0);
  const compareTotal = compareByKey ? sumOf(COMPARE_KEY) : undefined;

  return {
    data,
    series: compareByKey ? [...seriesKeys, COMPARE_KEY] : seriesKeys,
    total,
    compareTotal,
    change:
      compareTotal === undefined || compareTotal === 0
        ? undefined
        : (total - compareTotal) / compareTotal,
  };
}
