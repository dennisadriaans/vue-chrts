/**
 * The metric layer: the small amount of logic that sits between "a business
 * question" and a {@link ChartSpec}.
 *
 * Everything here is a pure function, for the same reason the transform stage
 * is: a metric's value formatting and its time window are things a server
 * route, a test, or a summary email may need without mounting a component.
 *
 * The division of labour is deliberate. This module decides *what window to
 * ask for* and *how to render a number*; the transform decides *what the
 * numbers are*. `<MetricChart>` composes the two and draws the chrome.
 */
import type { ChartSpec, SpecAggregate, SpecChartType, SpecInterval } from "./types";

/**
 * How a metric's values are rendered as text.
 *
 * A closed union rather than a formatter function, so a metric definition
 * stays serializable alongside the spec it produces. A caller needing
 * something else passes their own function through `valueFormatter`.
 */
export type MetricFormat = "number" | "currency" | "percent" | "compact" | "duration";

/**
 * A selectable time window.
 *
 * `days` drives the range arithmetic; `interval` is the bucket width that
 * keeps the chart readable at that span — 7 days of monthly buckets would be
 * a single point, and a year of daily buckets is 365 marks of noise.
 */
export interface MetricRange {
  /** Stable key, used as the selector's value and `v-model`. */
  key: string;
  /** Short label for the selector button (`30D`). */
  label: string;
  /** Accessible name, since `30D` alone does not read well aloud. */
  title?: string;
  /** Window length in days, counting back from the anchor date. */
  days: number;
  /** Bucket width for this window. */
  interval: SpecInterval;
}

/**
 * The default range set: a week, a month, a quarter, a year.
 *
 * These four cover the overwhelming majority of dashboard use, and their
 * intervals are chosen so every window lands between roughly 7 and 90 marks —
 * enough shape to read a trend, few enough to stay legible.
 */
export const DEFAULT_RANGES: readonly MetricRange[] = [
  { key: "7d", label: "7D", title: "Last 7 days", days: 7, interval: "day" },
  { key: "30d", label: "30D", title: "Last 30 days", days: 30, interval: "day" },
  { key: "3m", label: "3M", title: "Last 3 months", days: 90, interval: "week" },
  { key: "1y", label: "1Y", title: "Last 12 months", days: 365, interval: "month" },
];

/** Milliseconds in a day. Windows are whole days, anchored at UTC midnight. */
const DAY_MS = 86_400_000;

/**
 * The `{ from, to }` window for a range, counting back from an anchor date.
 *
 * Anchored in UTC to match the transform's bucketing: a window computed in
 * local time can start a day either side of the buckets it is meant to select,
 * which silently drops or doubles an edge bucket.
 *
 * The window is inclusive at both ends, so a 7-day range covers today plus the
 * six days before it — what "last 7 days" means to a reader, rather than the
 * eight days a naive `to - 7` would select.
 */
export function resolveRange(
  range: Pick<MetricRange, "days">,
  anchor?: string | number | Date,
): { from: string; to: string } {
  const now = anchor === undefined ? Date.now() : new Date(anchor).getTime();
  const end = Number.isFinite(now) ? now : Date.now();
  const date = new Date(end);
  const to = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const from = to - (Math.max(1, Math.round(range.days)) - 1) * DAY_MS;
  return { from: isoDate(from), to: isoDate(to) };
}

/** `2026-09-13` for a timestamp, in UTC. */
function isoDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

/** Inputs a metric needs to describe itself as a spec. */
export interface MetricSpecInput {
  type: SpecChartType;
  x: string;
  y?: string;
  series?: string;
  aggregate?: SpecAggregate;
  interval: SpecInterval;
  compare?: ChartSpec["compare"];
  range: { from: string; to: string };
  label?: string;
}

/**
 * Assemble a {@link ChartSpec} from a metric's props.
 *
 * Trivial by design: the value of `<MetricChart>` is that it *produces* a
 * spec rather than reimplementing aggregation, and keeping that assembly in
 * one named function makes the boundary visible — and testable without Vue.
 */
export function metricSpec(input: MetricSpecInput): ChartSpec {
  return {
    type: input.type,
    dimensions: { x: input.x, y: input.y, series: input.series },
    transform: { interval: input.interval, aggregate: input.aggregate ?? "sum" },
    range: input.range,
    // A series split and a comparison both claim the series dimension; the
    // transform resolves that in favour of the split, so asking for both here
    // would render a chart whose legend contradicts the header's "vs previous".
    compare: input.series ? undefined : input.compare,
    label: input.label,
  };
}

/** Options for {@link formatMetricValue}. */
export interface MetricFormatOptions {
  format?: MetricFormat;
  /** ISO 4217 code, used only by the `currency` format. Default `EUR`. */
  currency?: string;
  locale?: string;
  /** Overrides the format's own defaults (`maximumFractionDigits`, …). */
  options?: Intl.NumberFormatOptions;
}

/**
 * Render a metric value as display text.
 *
 * Each format carries the fraction-digit defaults that suit it, because the
 * right precision is a property of what the number *means*: money shows whole
 * units on a headline, a rate needs a decimal to show movement at all, and a
 * compact number's whole point is brevity.
 *
 * `percent` takes a value already in percent units (`4.8` -> `4.8%`), not the
 * `0.048` fraction `Intl`'s percent style expects. Metric fields hold rates as
 * humans record them, and silently multiplying by 100 surprises every caller
 * whose column is already a percentage.
 */
export function formatMetricValue(
  value: number,
  { format = "number", currency = "EUR", locale, options }: MetricFormatOptions = {},
): string {
  if (!Number.isFinite(value)) return "—";

  if (format === "duration") return formatDuration(value, locale, options);

  const defaults: Intl.NumberFormatOptions
    = format === "currency"
      ? { style: "currency", currency, maximumFractionDigits: 0 }
      : format === "percent"
        ? { maximumFractionDigits: 1 }
        : format === "compact"
          ? { notation: "compact", maximumFractionDigits: 1 }
          : { maximumFractionDigits: 0 };

  const text = new Intl.NumberFormat(locale, { ...defaults, ...options }).format(value);
  return format === "percent" ? `${text}%` : text;
}

/**
 * Render a millisecond duration at a human scale.
 *
 * Latency is the motivating case: `182ms` is the unit an engineer thinks in,
 * while `0.182s` and `182,000µs` both force a mental conversion. The unit
 * steps up only once the number would otherwise grow unwieldy.
 */
function formatDuration(value: number, locale?: string, options?: Intl.NumberFormatOptions): string {
  const abs = Math.abs(value);
  const [scaled, unit, digits]: [number, string, number]
    = abs < 1000
      ? [value, "ms", 0]
      : abs < 60_000
        ? [value / 1000, "s", 1]
        : [value / 60_000, "min", 1];
  const text = new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
    ...options,
  }).format(scaled);
  return `${text}${unit}`;
}

/**
 * Render a fractional change (`0.124`) as a signed percentage (`+12.4%`).
 *
 * Signed explicitly, including the `+`, because a delta's direction is the
 * first thing read and an unsigned `12.4%` beside a total is ambiguous.
 */
export function formatChange(change: number | undefined, locale?: string): string | undefined {
  if (change === undefined || !Number.isFinite(change)) return undefined;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(change);
}

/**
 * Which way a delta should read.
 *
 * `direction` is the arithmetic sign; `sentiment` is whether that sign is good
 * news, which is not the same question. For latency, error rates or churn, a
 * fall is the win — so the colour is driven by `sentiment` and the arrow by
 * `direction`, and `inverse` flips only the former.
 */
export interface MetricDelta {
  direction: "up" | "down" | "flat";
  sentiment: "positive" | "negative" | "neutral";
}

/** Classify a change into an arrow direction and a sentiment. */
export function metricDelta(change: number | undefined, inverse = false): MetricDelta {
  if (change === undefined || !Number.isFinite(change) || change === 0) {
    return { direction: "flat", sentiment: "neutral" };
  }
  const direction = change > 0 ? "up" : "down";
  const good = inverse ? change < 0 : change > 0;
  return { direction, sentiment: good ? "positive" : "negative" };
}
