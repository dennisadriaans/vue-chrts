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
      "StatusTrackerChartProps",
      "StatusTrackerDatum",
      "BulletLegendItemInterface",
      "AxisConfig",
      "TooltipConfig",
      "ValueLabel",
      "ReferenceLineConfig",
    ],
  });
};
