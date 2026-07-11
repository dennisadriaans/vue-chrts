import { addComponent, createResolver } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

/** Component name -> runtime adapter file (relative to src/runtime/components). */
// SankeyChart is deferred to iteration 2: vccs@0.4.0 (latest published) has no
// Sankey export. The adapter lives in components/_deferred/ until vccs ships it.
const COMPONENTS = {
  AreaChart: "AreaChart",
  BarChart: "BarChart",
  LineChart: "LineChart",
  DonutChart: "DonutChart",
  BubbleChart: "BubbleChart",
  RadarChart: "RadarChart",
  RadialBarChart: "RadialBarChart",
  FunnelChart: "FunnelChart",
  CandlestickChart: "CandlestickChart",
  StatusTrackerChart: "StatusTrackerChart",
} as const;

export type ComponentName = keyof typeof COMPONENTS;

/**
 * Register the adapter components with Nuxt.
 *
 * Registered `mode: "client"` because `vccs` measures the DOM
 * (`ResponsiveContainer`) and is not SSR-renderable; client-only avoids a
 * hydration mismatch and matches the v2 module's behaviour.
 */
export const resolveComponents = (config: ModuleOptions, resolverUrl: string) => {
  const { prefix, include, global } = config;
  const { resolve } = createResolver(resolverUrl);

  const names = (Object.keys(COMPONENTS) as ComponentName[]).filter((name) =>
    include?.length ? include.includes(name) : true,
  );

  for (const name of names) {
    addComponent({
      name: `${prefix}${name}`,
      filePath: resolve(`./runtime/components/${COMPONENTS[name]}.vue`),
      mode: "client",
      global,
    });
  }

};
