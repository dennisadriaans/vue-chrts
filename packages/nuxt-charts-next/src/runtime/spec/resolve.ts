/**
 * Spec -> renderer props.
 *
 * The transform stage decides *what the numbers are*; this stage decides *what
 * the chart component is handed*. Separating them keeps the chart adapters
 * unchanged — `DataChart` produces exactly the `categories` / `xAxis` / `yAxis`
 * props a hand-written `<LineChart>` would have received.
 */
import type { BulletLegendItemInterface } from "../types/shared";
import { COMPARE_KEY, VALUE_KEY, type ChartSpec, type SpecInterval } from "./types";

/**
 * Human-readable label for a series key.
 *
 * The synthetic keys get prose; a `series`-split value is already a real label
 * (a plan name, a region) and is left exactly as the data spelled it.
 */
export function seriesLabel(key: string, spec: ChartSpec): string {
  if (key === COMPARE_KEY) {
    return spec.compare === "previous-year" ? "Previous year" : "Previous period";
  }
  if (key === VALUE_KEY) {
    return spec.label ?? titleCase(spec.dimensions.y ?? "Count");
  }
  return key;
}

/** `createdAt` / `created_at` / `created-at` -> `Created at`. */
export function titleCase(field: string): string {
  const spaced = field
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Build the `categories` record the chart adapters expect.
 *
 * The comparison series is deliberately not given a colour: leaving it
 * undefined lets `categoriesToSeries` assign the next `--vc-series-*` token,
 * so a baseline picks up the host theme like any other series instead of
 * hardcoding a grey that fights the design system in dark mode.
 */
export function specCategories(
  series: readonly string[],
  spec: ChartSpec,
): Record<string, BulletLegendItemInterface> {
  return Object.fromEntries(
    series.map((key) => [key, { name: seriesLabel(key, spec) }]),
  );
}

/**
 * Format a bucket key (`2026-03-01`) for the x axis.
 *
 * Buckets are UTC-anchored, so the formatter is pinned to UTC as well —
 * otherwise a viewer west of Greenwich sees every month labelled as the
 * previous one.
 */
export function formatBucket(
  key: string,
  interval: SpecInterval | undefined,
  locale?: string,
): string {
  if (!interval) return key;
  const time = Date.parse(key);
  if (!Number.isFinite(time)) return key;
  const options: Intl.DateTimeFormatOptions
    = interval === "month"
      ? { month: "short", year: "2-digit", timeZone: "UTC" }
      : { month: "short", day: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat(locale, options).format(new Date(time));
}

/**
 * Validate a spec, returning a human-readable reason when it cannot render.
 *
 * Specs are expected to arrive from outside the codebase — a database row, an
 * API response, eventually a model — so the failure mode has to be a message
 * the caller can show, not a thrown exception mid-render.
 */
export function validateSpec(spec: ChartSpec | undefined): string | undefined {
  if (!spec) return "No chart spec provided.";
  if (!spec.dimensions?.x) return "Chart spec is missing `dimensions.x`.";
  const aggregate = spec.transform?.aggregate ?? "sum";
  if (aggregate !== "count" && !spec.dimensions.y) {
    return `Chart spec needs \`dimensions.y\` for the \`${aggregate}\` aggregate.`;
  }
  if (spec.compare && !spec.range) {
    return "Chart spec needs a `range` to compare against a previous period.";
  }
  if (spec.compare && !spec.transform?.interval) {
    return "Chart spec needs `transform.interval` to align a comparison series.";
  }
  return undefined;
}
