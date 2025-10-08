import type { AreaChartProps } from "../AreaChart/types";

export type LineChartProps<T> = Omit<
  AreaChartProps<T>,
  "hideArea" | "gradientStops"
>;