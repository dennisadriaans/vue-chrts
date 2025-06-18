// Define TypeScript types for BubbleChart component

/**
 * Represents a single data point for a bubble in the chart.
 */
export interface BubbleDataItem {
  id: string; // Unique identifier for the bubble
  xValue: number | string | Date; // Value for the x-axis
  yValue: number | string | Date; // Value for the y-axis
  sizeValue: number; // Determines the size of the bubble
  label?: string; // Optional label displayed on or near the bubble
  color?: string; // Optional specific color for this bubble
  category?: string; // Optional category for grouping or coloring
}

/**
 * Configuration for chart axes.
 */
export interface AxisOptions {
  show?: boolean; // Whether to display the axis
  label?: string; // Label for the axis
  tickFormat?: (value: any) => string; // Function to format tick labels
  gridlines?: boolean; // Whether to show gridlines for this axis
}

/**
 * Configuration for chart labels.
 */
export interface LabelOptions {
  show?: boolean; // Whether to display labels on bubbles
  fontSize?: number; // Font size for labels
  color?: string; // Color for labels
  fontFamily?: string; // Font family for labels
}

/**
 * Configuration for bubble colors.
 * Can be a single color, an array of colors, or an object mapping categories/values to colors.
 */
export type ColorOptions = string | string[] | Record<string, string>;

/**
 * Configuration for bubble sizes.
 */
export interface SizeOptions {
  minRadius?: number; // Minimum radius for a bubble
  maxRadius?: number; // Maximum radius for a bubble
  scale?: 'linear' | 'sqrt' | 'log'; // Scale to determine radius from sizeValue
}

/**
 * Props for the BubbleChart component.
 */
export interface BubbleChartProps {
  /** Array of data items to plot as bubbles. */
  data: BubbleDataItem[];

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

  /** Color configuration for bubbles.
   * - string: a single color for all bubbles.
   * - string[]: a list of colors to cycle through.
   * - Record<string, string>: a map from data item category/id to color.
   */
  colorOptions?: ColorOptions;

  /** Options for controlling bubble sizes. */
  sizeOptions?: SizeOptions;

  /** Title for the chart. */
  chartTitle?: string;

  /** Whether to show a legend. */
  showLegend?: boolean;

  /** Custom CSS class for the chart container. */
  customClass?: string;
}
