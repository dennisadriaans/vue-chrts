import type { AxisConfig, axisFormatter } from "../types/shared";

/** `vccs` axis `tickFormatter` signature. */
export type VccsTickFormatter = (value: unknown, index: number) => string;

/** A `vccs` axis tick value (numbers for value axes, strings for category axes). */
export type VccsAxisTick = number | string;

/** `vccs` axis `interval` values we use. */
export type VccsAxisInterval = number | "preserveStartEnd";

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
