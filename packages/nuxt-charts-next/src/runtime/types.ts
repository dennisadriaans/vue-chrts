/**
 * Public type surface for `nuxt-charts`.
 *
 * Re-exported via the module's `addImportsSources` so these auto-import in
 * consumer code (`from "nuxt-charts/types"`).
 */
export type * from "./types/shared";
export type * from "./types/charts";
// The data layer's serializable chart description and its transform result.
export type * from "./spec/types";
export type { TransformResult } from "./spec/transform";
// Style variant unions. These name the values the `variant` / `strokeVariant` /
// `legendVariant` / … props accept, so consumer code can annotate a value it
// stores or passes around rather than widening it to `string`.
export type {
  AreaFillVariant,
  BarVariant,
  DotVariant,
  LegendIndicatorVariant,
  RadarVariant,
  RadialVariant,
  StrokeVariant,
  TooltipRoundness,
  TooltipVariant,
} from "./utils/variants";
export type { BackgroundVariant } from "./utils/background";
export type { DitherVariant } from "./utils/dither";
