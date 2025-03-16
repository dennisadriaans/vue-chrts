// index.ts
import Progress from './Progress/Progress.vue';
import Status from './Status/Status.vue';
import Tooltip from './Tooltip/Tooltip.vue';
import type { 
  AreaChartType, 
  AreaStackedChartType, 
  BarChartType, 
  DonutChartType,
  LineChartType,
  PaginationPositionType,
  
  // Also import the prop types
  AreaChartProps,
  AreaStackedChartProps,
  BarChartProps,
  DonutChartProps,
  LineChartProps
} from './charts';

export { Progress, Status, Tooltip };

// Re-export prop types for easier access
export type {
  AreaChartProps,
  AreaStackedChartProps,
  BarChartProps,
  DonutChartProps,
  LineChartProps
};

// Define the return type of loadCharts
export interface ChartModules {
  AreaChart: AreaChartType;
  AreaStackedChart: AreaStackedChartType;
  BarChart: BarChartType;
  DonutChart: DonutChartType;
  LineChart: LineChartType;
  PaginationPosition: PaginationPositionType;
}

export const loadCharts = (): Promise<ChartModules> => {
  if ((import.meta as any).client || typeof window !== 'undefined') {
    return import('./charts').then((module) => {
      return module;
    });
  }
  return Promise.resolve({} as ChartModules);
};