import type { AreaChartProps } from "./area-chart";

export type LineChartProps<T> = Omit<
  AreaChartProps<T>,
  "hideArea" | "gradientStops"
>;
