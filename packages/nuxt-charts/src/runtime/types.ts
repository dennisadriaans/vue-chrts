/**
 * Type-only re-exports for Nuxt auto-imports.
 *
 * Nuxt's `addImportsSources({ type: true })` emits `import('…')` statements that
 * Vite must resolve at transform time. The published `vue-chrts/types` export is
 * types-only (no `import`/`default` condition), so bare `vue-chrts/types`
 * imports fail under Vite. Re-exporting through this local module keeps the
 * import graph resolvable.
 */
export type {
  BulletLegendItemInterface,
  MarkerConfig,
  CrosshairConfig,
  AxisConfig,
  TooltipConfig,
} from "vue-chrts";

export type { MapRegion, MapPin } from "vue-chrts";
