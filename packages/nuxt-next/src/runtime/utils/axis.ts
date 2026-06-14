import type { axisFormatter } from "../types/shared";

/** `vccs` axis `tickFormatter` signature. */
export type VccsTickFormatter = (value: unknown, index: number) => string;

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
