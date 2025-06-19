import { LegendPosition } from '../../types';

// Define TypeScript types for BubbleChart component (recreated from memory)

/**
 * Represents a single data point for a bubble in the chart.
 */
export interface BubbleDataItem {
  id: string; // Unique identifier for the bubble
  xValue: number | string | Date; // Value for the x-axis (if applicable for layout)
  yValue: number | string | Date; // Value for the y-axis (if applicable for layout)
  sizeValue: number; // Determines the size of the bubble
  label?: string; // Optional label displayed on or near the bubble
  color?: string; // Optional specific color for this bubble
  category?: string; // Optional category for grouping or coloring
}

/**
 * Configuration for chart axes (rudimentary).
 */
export interface AxisOptions {
  show?: boolean; // Whether to display the axis
  label?: string; // Label for the axis
  tickFormat?: (value: any) => string; // Function to format tick labels
  gridlines?: boolean; // Whether to show gridlines
  numTicks?: number; // Suggested number of ticks
}

/**
 * Configuration for chart labels on bubbles.
 */
export interface LabelOptions {
  show?: boolean; // Whether to display labels on bubbles
  fontSize?: number; // Font size for labels
  color?: string; // Color for labels
  fontFamily?: string; // Font family for labels
}

/**
 * Configuration for bubble colors.
 */
export type ColorOptions = string | string[] | Record<string, string>;

/**
 * Configuration for bubble sizes.
 */
export interface SizeOptions {
  minRadius?: number; // Minimum radius for a bubble
  maxRadius?: number; // Maximum radius for a bubble
  // scale?: 'linear' | 'sqrt' | 'log'; // Simplified, default to sqrt logic in component
}

/**
 * Props for the BubbleChart component.
 */
export interface BubbleChartProps<T> {
  /** Array of data items to plot as bubbles. */
  data: T[];

  /** Width of the chart SVG. */
  width?: number;

  /** Height of the chart SVG. */
  height?: number;

  /** Options for the X-axis. */
  xAxisOptions?: AxisOptions;

  /** Options for the Y-axis. */
  yAxisOptions?: AxisOptions;

  /** Options for bubble labels. */
  labelOptions?: LabelOptions;

  /** Color configuration for bubbles. */
  colorOptions?: ColorOptions;

  /** Options for controlling bubble sizes. */
  sizeOptions?: SizeOptions;

  /** Title for the chart. */
  chartTitle?: string;

  /** Whether to show a legend. */
  showLegend?: boolean;

  /** Custom CSS class for the chart container. */
  customClass?: string;

  // --- Added for BarChart compatibility ---
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  xLabel?: string;
  yLabel?: string;
  xGridLine?: boolean;
  yGridLine?: boolean;
  xDomainLine?: boolean;
  yDomainLine?: boolean;
  xTickLine?: boolean;
  yTickLine?: boolean;
  xFormatter?: (v: any) => string;
  yFormatter?: (v: any) => string;
  xNumTicks?: number;
  yNumTicks?: number;
  xExplicitTicks?: number[];
  minMaxTicksOnly?: boolean;
  hideLegend?: boolean;
  legendPosition?: LegendPosition;
}
