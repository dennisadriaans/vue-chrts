import type { CSSProperties } from "vue";
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

/**
 * Gap between the plot area and the legend. Applied as wrapper padding on the
 * side facing the chart so vccs's legend-size measurement reserves the extra
 * space in chart margins (see `appendOffsetOfLegend` in vccs).
 */
export const LEGEND_INSET = "var(--vc-legend-inset, 0.75rem)" as const;

/**
 * Build the `vccs` `<Legend wrapperStyle>` object: a position-aware inset
 * between chart and legend, merged with any user `legendStyle` overrides.
 */
export function resolveLegendWrapperStyle(
  position: LegendPosition | undefined,
  userStyle?: CSSProperties,
): CSSProperties {
  const { verticalAlign } = legendPositionToLegendProps(position);

  const insetStyle: CSSProperties =
    verticalAlign === "bottom"
      ? { paddingTop: LEGEND_INSET }
      : verticalAlign === "top"
        ? { paddingBottom: LEGEND_INSET }
        : {};

  return { ...insetStyle, ...userStyle };
}
