/**
 * The chart specification: a fully serializable description of what to plot.
 *
 * This is the layer between "application data" and "a rendered chart". A spec
 * says *what* to show — which fields, how to bucket them, how to aggregate,
 * what to compare against — and never *how* to draw it. Everything here is
 * plain JSON: no functions, no class instances, no `Date` objects. That is a
 * deliberate constraint, not an accident of the current implementation.
 *
 * Keeping it JSON means a spec can cross a boundary: stored in a database,
 * sent over the wire, written by hand in a config file, or produced by a model
 * from a natural-language question. Formatting concerns that genuinely need a
 * function (custom tick formatters, tooltip templates) stay on the rendering
 * props, so the spec itself survives `JSON.stringify` / `JSON.parse` intact.
 */

/** Chart forms a spec can request. Deliberately small for the first version. */
export type SpecChartType = "line" | "area" | "bar";

/**
 * How rows sharing an x bucket are collapsed into one value.
 *
 * `count` ignores the y field entirely and counts rows, which is why the
 * dimension's `y` is optional when counting.
 */
export type SpecAggregate = "sum" | "average" | "count" | "min" | "max";

/** Calendar bucket width for a temporal x dimension. */
export type SpecInterval = "day" | "week" | "month";

/**
 * A baseline to plot alongside the current period.
 *
 * `previous-period` shifts the window back by its own length (the 30 days
 * before the visible 30 days); `previous-year` shifts it back one calendar
 * year, which is the right comparison for seasonal data.
 */
export type SpecCompare = "previous-period" | "previous-year";

/** Which row fields feed the axes. */
export interface SpecDimensions {
  /** Field plotted on the category (x) axis. */
  x: string;
  /**
   * Field aggregated onto the value (y) axis. Optional only for `count`,
   * which measures rows rather than a field.
   */
  y?: string;
  /**
   * Field whose distinct values split the data into separate series.
   *
   * Each distinct value becomes its own line/area/bar group, aggregated
   * independently. Cannot be combined with `compare` — both want to own the
   * series dimension, and stacking them produces a chart nobody can read.
   */
  series?: string;
}

/** How raw rows are reshaped before they reach the renderer. */
export interface SpecTransform {
  /**
   * Bucket a temporal x dimension to this calendar width. Omit to treat the
   * x values as opaque categories and group on exact equality.
   */
  interval?: SpecInterval;
  /** How rows in a bucket are collapsed. Default `sum`. */
  aggregate?: SpecAggregate;
  /**
   * Sort order of the resulting buckets. Temporal data defaults to `asc`
   * (time reads left to right); categorical data defaults to `none`, which
   * preserves first-seen order from the source rows.
   */
  sort?: "asc" | "desc" | "none";
  /**
   * Keep only the N largest buckets by value. Applied after aggregation, and
   * meaningful mainly for categorical x dimensions.
   */
  limit?: number;
  /**
   * Emit buckets with no matching rows as zero instead of omitting them.
   * Only possible with an `interval`, which defines what the missing buckets
   * would have been. Default `true` — a gap in a time series is information,
   * and silently closing it misrepresents the trend.
   */
  fillGaps?: boolean;
}

/**
 * A complete, serializable chart description.
 *
 * @example
 * ```ts
 * const spec: ChartSpec = {
 *   type: "line",
 *   dimensions: { x: "createdAt", y: "amount" },
 *   transform: { interval: "month", aggregate: "sum" },
 *   compare: "previous-period",
 * };
 * ```
 */
export interface ChartSpec {
  type: SpecChartType;
  dimensions: SpecDimensions;
  transform?: SpecTransform;
  /** Plot a shifted copy of the window as a second, muted series. */
  compare?: SpecCompare;
  /**
   * Restrict rows to a closed date window before aggregating, as ISO date
   * strings. Required for `compare`: without a window there is no "period" to
   * step back from.
   */
  range?: { from: string; to: string };
  /** Display label for the primary series. Defaults to the `y` field name. */
  label?: string;
}

/**
 * One aggregated row produced by the transform, ready for the renderer.
 *
 * The x bucket is carried under a dedicated `x` key so the series values can
 * stay purely numeric. Typing the index signature as `string | number` instead
 * would make every key non-numeric as far as the renderers' `NumericKeys<T>`
 * constraint is concerned, and no series could be plotted.
 *
 * `undefined` is a deliberate member: with `fillGaps` off, a bucket a series
 * has no rows for is a hole in the line rather than a zero.
 */
export interface SpecDatum {
  /** Bucket label for the x axis. */
  x: string;
  /** Aggregated values, keyed by series name. */
  [series: string]: string | number | undefined;
}

/** Series key used for the shifted comparison series. */
export const COMPARE_KEY = "compare";
/** Series key used when a spec has neither a `series` split nor a compare. */
export const VALUE_KEY = "value";
