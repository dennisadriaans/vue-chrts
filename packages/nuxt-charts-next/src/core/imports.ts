import { addImportsSources, createResolver } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

/**
 * Auto-import the public enums (as runtime values) and shared types so consumer
 * code can use `CurveType`, `LegendPosition`, etc. and the prop interfaces
 * without explicit imports — preserving the v2 DX.
 */
export const resolveImports = (config: ModuleOptions, resolverUrl: string) => {
  if (!config.autoImports) return;

  const { resolve } = createResolver(resolverUrl);

  // Runtime enums (real values, usable in templates/script).
  addImportsSources({
    from: resolve("./runtime/enums"),
    imports: ["CurveType", "LegendPosition", "Orientation", "DonutType"],
  });

  // Public types (type-only).
  addImportsSources({
    from: resolve("./runtime/types"),
    type: true,
    imports: [
      "AreaChartProps",
      "BarChartProps",
      "LineChartProps",
      "BubbleChartProps",
      "DonutChartProps",
      "RadarChartProps",
      "RadialBarChartProps",
      "FunnelChartProps",
      "FunnelLabelSizes",
      "SankeyChartProps",
      "SankeyInputNode",
      "SankeyInputLink",
      "SankeyNodeAlign",
      "CandlestickChartProps",
      "StatusTrackerChartProps",
      "StatusTrackerDatum",
      "BulletLegendItemInterface",
      "AxisConfig",
      "ValueLabel",
      "ReferenceLineConfig",
      // v2 parity: these auto-imported in nuxt-charts v2. The types still exist
      // (MarkerConfig drives line/area dot rendering; CrosshairConfig is inert
      // but kept so old templates type-check), so keep them auto-importable.
      "MarkerConfig",
      "CrosshairConfig",
      // Style variant unions, so a consumer can annotate a variant it stores or
      // passes around instead of widening it to `string`.
      "BarVariant",
      "AreaFillVariant",
      "StrokeVariant",
      "DotVariant",
      "DitherVariant",
      "BackgroundVariant",
      "LegendIndicatorVariant",
      "TooltipVariant",
      "TooltipRoundness",
      "RadarVariant",
      "RadialVariant",
    ],
  });

  // The data layer. `ChartSpec` and friends are types, but the transform and
  // CSV helpers are real functions a consumer calls directly (in a server
  // route, or to compute a header total beside the chart).
  addImportsSources({
    from: resolve("./runtime/spec"),
    imports: ["transform", "toCsv", "validateSpec", "seriesLabel", "formatBucket"],
  });

  addImportsSources({
    from: resolve("./runtime/spec"),
    type: true,
    imports: [
      "ChartSpec",
      "SpecChartType",
      "SpecAggregate",
      "SpecInterval",
      "SpecCompare",
      "SpecDimensions",
      "SpecTransform",
      "SpecDatum",
      "TransformResult",
    ],
  });
};
