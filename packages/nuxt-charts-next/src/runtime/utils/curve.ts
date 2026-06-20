import { CurveType } from "../enums";

/**
 * The subset of `vccs` curve `type` strings we map onto. `vccs`'s union also
 * includes `bump*` variants and a `CurveFactory`, which the v2 `CurveType`
 * enum has no members for, so they're unreachable here.
 */
export type VccsCurveType =
  | "basis"
  | "basisClosed"
  | "basisOpen"
  | "linear"
  | "linearClosed"
  | "natural"
  | "monotoneX"
  | "monotoneY"
  | "monotone"
  | "step"
  | "stepBefore"
  | "stepAfter";

/**
 * Exhaustive map from the public {@link CurveType} enum to a `vccs` curve
 * `type` string. Typed as `Record<CurveType, …>` so adding an enum member
 * without a mapping is a compile error — no assertions, full narrowing.
 *
 * `vccs` has no Cardinal / CatmullRom / Bundle curves, so those v2 members
 * fall back to their nearest visual equivalent.
 */
const CURVE_MAP: Record<CurveType, VccsCurveType> = {
  [CurveType.Basis]: "basis",
  [CurveType.BasisClosed]: "basisClosed",
  [CurveType.BasisOpen]: "basisOpen",
  // No direct vccs equivalent — basis is the closest smooth spline.
  [CurveType.Bundle]: "basis",
  [CurveType.Cardinal]: "natural",
  [CurveType.CardinalClosed]: "basisClosed",
  [CurveType.CardinalOpen]: "basisOpen",
  [CurveType.CatmullRom]: "natural",
  [CurveType.CatmullRomClosed]: "basisClosed",
  [CurveType.CatmullRomOpen]: "basisOpen",
  [CurveType.Linear]: "linear",
  [CurveType.LinearClosed]: "linearClosed",
  [CurveType.MonotoneX]: "monotoneX",
  [CurveType.MonotoneY]: "monotoneY",
  [CurveType.Natural]: "natural",
  [CurveType.Step]: "step",
  [CurveType.StepAfter]: "stepAfter",
  [CurveType.StepBefore]: "stepBefore",
};

/**
 * Translate a {@link CurveType} into the `vccs` curve `type` string.
 * Defaults to `monotone` when unset (matches v2's smooth default).
 */
export function curveTypeToVccs(curve: CurveType | undefined): VccsCurveType {
  if (curve === undefined) return "monotone";
  return CURVE_MAP[curve];
}
