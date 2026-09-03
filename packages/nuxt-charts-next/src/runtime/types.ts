/**
 * Public type surface for `nuxt-charts`.
 *
 * Re-exported via the module's `addImportsSources` so these auto-import in
 * consumer code (`from "nuxt-charts/types"`).
 */
export type * from "./types/shared";
export type * from "./types/charts";
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
