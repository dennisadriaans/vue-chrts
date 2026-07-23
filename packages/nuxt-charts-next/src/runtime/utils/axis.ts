import type { AxisConfig, AxisId, axisFormatter, YAxisConfig } from "../types/shared";
import { PRIMARY_Y_AXIS_ID, normalizeAxisId, type SeriesDescriptor } from "./categories";
import { toAxisDomain } from "./style";

/** `vccs` axis `tickFormatter` signature. */
export type VccsTickFormatter = (value: unknown, index: number) => string;

/** A `vccs` axis tick value (numbers for value axes, strings for category axes). */
export type VccsAxisTick = number | string;

/** `vccs` axis `interval` values we use. */
export type VccsAxisInterval = number | "preserveStartEnd";

/**
 * Axis slot sizing tuned for gallery / dashboard charts. vccs defaults (Y width
 * 60, X height 30, tickMargin 2) leave the value Y-axis too far from the plot
 * and X tick labels hugging the bottom edge.
 */
export const AXIS_SLOT = {
  numericYWidth: 40,
  categoryYWidth: 72,
  titledYWidth: 72,
  defaultXHeight: 38,
  titledXHeight: 52,
} as const;

export function resolveYAxisWidth(options: {
  hasTitle: boolean;
  isCategoryAxis: boolean;
}): number {
  if (options.hasTitle) return AXIS_SLOT.titledYWidth;
  if (options.isCategoryAxis) return AXIS_SLOT.categoryYWidth;
  return AXIS_SLOT.numericYWidth;
}

export function resolveXAxisHeight(options: { hasTitle: boolean }): number {
  return options.hasTitle ? AXIS_SLOT.titledXHeight : AXIS_SLOT.defaultXHeight;
}

/**
 * Gap (in px) between an axis line and its tick labels, passed to the native
 * `vccs` `tickMargin` prop. vccs positions labels in SVG space from this value
 * (X labels hang below the axis, Y labels are right-aligned toward the plot and
 * vertically centred on each gridline), so we let it own positioning instead of
 * nudging with CSS transforms. vccs's own default (2) leaves labels cramped.
 */
export const AXIS_TICK_MARGIN = {
  /** Between the x-axis line and the tick label below it. */
  x: 8,
  /** Between the plot edge and the right-aligned y tick label. */
  y: 8,
} as const;

/**
 * The native `vccs` `tick` prop value for an axis. vccs accepts `true` (default
 * SVG presentation, with per-orientation `textAnchor` / `verticalAnchor`) or an
 * object of SVG attrs that override those defaults. We only ever override the
 * horizontal anchor (from `AxisConfig.tickTextAlign`); colour / size / weight
 * are themed via CSS variables on `.v-charts-cartesian-axis-tick-value`.
 */
export function toTickProp(
  tick: Record<string, unknown> | undefined,
): true | { textAnchor: string } {
  if (tick && typeof tick.textAnchor === "string") return { textAnchor: tick.textAnchor };
  return true;
}

/**
 * Resolved subset of `vccs` axis props derived from the v2 config API. Centralises
 * the mapping for the props that *do* have a `vccs` equivalent (explicit ticks,
 * min/max-only) so both axes in {@link CartesianFrame} stay consistent.
 */
export interface ResolvedAxisProps {
  /** Explicit tick values (`xExplicitTicks` / `tickValues`). */
  ticks: VccsAxisTick[] | undefined;
  /** Tick thinning. `preserveStartEnd` approximates v2 `minMaxTicksOnly`. */
  interval: VccsAxisInterval | undefined;
  /** Per-tick SVG presentation attributes (colour / font-size) from `AxisConfig`. */
  tick: Record<string, unknown> | undefined;
}

/** Coerce a v2 explicit-tick array (numbers / strings / Dates) to `vccs` ticks. */
function toAxisTicks(
  values: ReadonlyArray<number | string | Date> | undefined,
): VccsAxisTick[] | undefined {
  if (!values || values.length === 0) return undefined;
  return values.map((v) => (v instanceof Date ? v.getTime() : v));
}

/**
 * Build `vccs` axis presentation props from the v2 explicit-tick props and
 * {@link AxisConfig}. `explicitTicks` is the standalone `xExplicitTicks` /
 * `yExplicitTicks` prop; `AxisConfig.tickValues` is the equivalent nested form
 * and takes precedence when both are set.
 *
 * `minMaxTicksOnly` (top-level or in `AxisConfig`) maps onto
 * `interval="preserveStartEnd"`, the closest `vccs` analog of "first & last only".
 */
export function resolveAxisProps(
  explicitTicks: ReadonlyArray<number | string | Date> | undefined,
  config: AxisConfig | undefined,
  minMaxTicksOnly: boolean | undefined,
): ResolvedAxisProps {
  const ticks = toAxisTicks(config?.tickValues ?? explicitTicks);
  const minMax = minMaxTicksOnly ?? config?.minMaxTicksOnly ?? false;

  // SVG presentation attributes vccs forwards onto each tick <text>.
  const tickAttrs: Record<string, unknown> = {};
  if (config?.tickTextColor) tickAttrs.fill = config.tickTextColor;
  if (config?.tickTextFontSize) tickAttrs.fontSize = config.tickTextFontSize;
  if (config?.tickTextAlign) {
    tickAttrs.textAnchor =
      config.tickTextAlign === "left"
        ? "start"
        : config.tickTextAlign === "right"
          ? "end"
          : "middle";
  }

  return {
    ticks,
    interval: minMax ? "preserveStartEnd" : undefined,
    tick: Object.keys(tickAttrs).length ? tickAttrs : undefined,
  };
}

/** One resolved y-axis, ready to render as a `vccs` `<YAxis>`. */
export interface ResolvedYAxis extends ResolvedAxisProps {
  id: AxisId;
  orientation: "left" | "right";
  label: string | undefined;
  domain: readonly [number, number] | undefined;
  tickCount: number | undefined;
  tickFormatter: VccsTickFormatter | undefined;
  tickLine: boolean;
  hide: boolean;
}

/**
 * Build the list of y-axes to render.
 *
 * The primary axis (id {@link PRIMARY_Y_AXIS_ID}) is always present and driven
 * by the top-level `yLabel` / `yDomain` / `yAxisConfig` props, so single-axis
 * charts are unaffected. Each additional id referenced by a series' `yAxis` — or
 * declared in `yAxes` — becomes its own axis, falling back to the primary axis'
 * settings for anything its {@link YAxisConfig} leaves unset.
 *
 * Axes are emitted in `yAxes` declaration order (primary first) so the render
 * order is stable and predictable when several share a side.
 */
export function resolveYAxes(options: {
  series: readonly SeriesDescriptor[];
  yAxes: Record<AxisId, YAxisConfig> | undefined;
  primary: Omit<ResolvedYAxis, "id" | "orientation">;
  minMaxTicksOnly: boolean | undefined;
}): ResolvedYAxis[] {
  const { series, yAxes, primary, minMaxTicksOnly } = options;

  // Object keys are always strings, so ids are canonicalised before deduping —
  // otherwise a numeric id declared in `yAxes` would never match the same id
  // written as a number on a category. See `normalizeAxisId`.
  const ids: AxisId[] = [PRIMARY_Y_AXIS_ID];
  const seen = new Set<AxisId>([PRIMARY_Y_AXIS_ID]);
  for (const raw of [...Object.keys(yAxes ?? {}), ...series.map((s) => s.yAxisId)]) {
    const id = normalizeAxisId(raw);
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }

  /** Axes default to the left, matching the single-axis behaviour. */
  const DEFAULT_ORIENTATION = "left" as const;

  return ids.map((id) => {
    // Look the config up under both spellings: `ids` holds canonical ids, but the
    // `yAxes` record may have been written with the other form.
    const config = yAxes?.[id] ?? yAxes?.[String(id) as unknown as AxisId];
    if (!config) return { ...primary, id, orientation: DEFAULT_ORIENTATION };

    const resolved = resolveAxisProps(undefined, config, config.minMaxTicksOnly ?? minMaxTicksOnly);
    return {
      ...primary,
      ...resolved,
      id,
      orientation: config.orientation ?? DEFAULT_ORIENTATION,
      label: config.label ?? (id === PRIMARY_Y_AXIS_ID ? primary.label : undefined),
      domain: toAxisDomain(config.domain) ?? primary.domain,
      tickCount: config.numTicks ?? primary.tickCount,
      tickFormatter: toTickFormatter(config.formatter ?? config.tickFormat) ?? primary.tickFormatter,
      tickLine: config.tickLine ?? primary.tickLine,
      hide: config.hide ?? false,
    };
  });
}

/**
 * Adapt a v2 {@link axisFormatter} to the `vccs` `tickFormatter(value, index)`
 * signature. Returns `undefined` when no formatter is supplied so the axis
 * falls back to `vccs`'s default rendering.
 *
 * The v2 union accepts either a number- or Date-typed tick; both are forwarded
 * as-is, matching how Unovis called them.
 */
export function toTickFormatter(
  formatter: axisFormatter | undefined,
): VccsTickFormatter | undefined {
  if (!formatter) return undefined;
  return (value, index) =>
    (formatter as (tick: unknown, i?: number) => string)(value, index);
}

/** `vccs` axis title config (string labels default to the axis centre and overlap ticks). */
export type VccsAxisLabel = {
  value: string;
  position: "insideBottom" | "insideLeft" | "insideRight";
  offset: number;
  angle?: number;
  textAnchor?: "start" | "middle" | "end";
  fill: string;
  fontSize: string;
  fontWeight: string | number;
};

/**
 * Build a positioned axis title for `vccs` cartesian axes.
 *
 * Plain strings land at the axis midpoint; `insideBottom` / `insideLeft` keep
 * titles clear of tick values and inside the reserved axis slot.
 */
export function toAxisLabel(
  text: string | undefined,
  position: "insideBottom" | "insideLeft" | "insideRight",
  options?: { angle?: number; offset?: number },
): VccsAxisLabel | undefined {
  if (!text) return undefined;
  const isVertical = position === "insideLeft" || position === "insideRight";
  return {
    value: text,
    position,
    offset: options?.offset ?? (isVertical ? 8 : 4),
    ...(options?.angle !== undefined ? { angle: options.angle } : {}),
    ...(isVertical && options?.angle !== undefined
      ? { textAnchor: "middle" as const }
      : {}),
    fill: "var(--vc-axis-label-color)",
    fontSize: "var(--vc-axis-label-size)",
    fontWeight: "var(--vc-axis-label-weight)",
  };
}
