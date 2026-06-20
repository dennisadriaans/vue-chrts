import { addComponent } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveComponents = (config: ModuleOptions, filePath: string) => {
  const { prefix, include, global } = config;
  const allComponents = [
    "AreaChart",
    "LineChart",
    "BarChart",
    "DonutChart",
    "BubbleChart",
    "GanttChart",
    "DagreGraph",
    "DualChart",
    "SankeyChart",
    "TopoJSONMap",
    "DottedMap",
  ];

  const components = include?.length
    ? allComponents.filter((component) => include.includes(component))
    : allComponents;

  components.forEach((component) => {
    addComponent({
      export: component,
      name: prefix + component,
      mode: "client",
      global,
      filePath,
    });
  });
};
