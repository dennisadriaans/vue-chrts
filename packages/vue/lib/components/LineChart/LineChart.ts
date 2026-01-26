import type { AreaChartProps } from "../AreaChart/AreaChart";

export type LineChartProps<T> = Omit<
  AreaChartProps<T>,
  "hideArea" | "gradientStops"
>;
