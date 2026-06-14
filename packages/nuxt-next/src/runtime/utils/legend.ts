import { LegendPosition } from "../enums";

/** `vccs` `<Legend>` horizontal alignment. */
export type LegendAlign = "left" | "center" | "right";
/** `vccs` `<Legend>` vertical alignment. */
export type LegendVerticalAlign = "top" | "middle" | "bottom";

export interface VccsLegendProps {
  align: LegendAlign;
  verticalAlign: LegendVerticalAlign;
  layout: "horizontal" | "vertical";
}

/**
 * Exhaustive map from the public {@link LegendPosition} enum to `vccs`
 * `<Legend>` props. Typed as `Record<LegendPosition, …>` so every enum member
 * must be handled — no fallthrough, no assertions.
 */
const LEGEND_MAP: Record<LegendPosition, VccsLegendProps> = {
  [LegendPosition.TopLeft]: { align: "left", verticalAlign: "top", layout: "horizontal" },
  [LegendPosition.TopCenter]: { align: "center", verticalAlign: "top", layout: "horizontal" },
  [LegendPosition.TopRight]: { align: "right", verticalAlign: "top", layout: "horizontal" },
  [LegendPosition.BottomLeft]: { align: "left", verticalAlign: "bottom", layout: "horizontal" },
  [LegendPosition.BottomCenter]: { align: "center", verticalAlign: "bottom", layout: "horizontal" },
  [LegendPosition.BottomRight]: { align: "right", verticalAlign: "bottom", layout: "horizontal" },
};

/**
 * Translate a {@link LegendPosition} into `vccs` `<Legend>` props.
 * Defaults to bottom-centre (matches v2).
 */
export function legendPositionToLegendProps(
  position: LegendPosition | undefined,
): VccsLegendProps {
  if (position === undefined) return LEGEND_MAP[LegendPosition.BottomCenter];
  return LEGEND_MAP[position];
}
