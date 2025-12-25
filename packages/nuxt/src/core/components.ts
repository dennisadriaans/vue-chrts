import { addComponent } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveComponents = (config: ModuleOptions, filePath: string) => {
  const { prefix } = config;
  const allComponents = [
    "AreaChart",
    "AreaStackedChart",
    "LineChart",
    "BarChart",
    "DonutChart",
    'BubbleChart',
    'GanttChart',
    'TopoJSONMap',
    'DottedWorldMap'
  ];

  allComponents.forEach((component) => {
    if (typeof component === "string") {
      addComponent({
        export: component,
        name: prefix + component,
        mode: "client",
        filePath,
      });
    } else if (Array.isArray(component)) {
      addComponent({
        export: component[0],
        name: prefix + component[1],
        mode: "client",
        filePath,
      });
    }
  });
};
