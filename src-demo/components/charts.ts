// charts.ts
import { AreaChart } from "./Area/index";
import { AreaStackedChart } from "./AreaStacked/index";
import { BarChart } from "./Bar/index";
import { DonutChart } from "./Donut/index";
import { LineChart, PaginationPosition } from "./Line/index";

// Export the component prop types
import type { AreaChartProps } from './Area';
import type { AreaStackedChartProps } from './AreaStacked';
import type { BarChartProps } from './Bar';
import type { DonutChartProps } from './Donut';
import type { LineChartProps } from './Line';

export type AreaChartType = typeof AreaChart;
export type AreaStackedChartType = typeof AreaStackedChart;
export type BarChartType = typeof BarChart;
export type DonutChartType = typeof DonutChart;
export type LineChartType = typeof LineChart;
export type PaginationPositionType = typeof PaginationPosition;

export type { 
  AreaChartProps,
  AreaStackedChartProps,
  BarChartProps,
  DonutChartProps,
  LineChartProps
};

export {
  AreaChart,
  AreaStackedChart,
  BarChart,
  DonutChart,
  LineChart,
  PaginationPosition,
};