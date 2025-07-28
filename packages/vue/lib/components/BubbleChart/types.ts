import {
  axisFormatter,
  BulletLegendItemInterface,
  LegendPosition,
} from "../../types";

export type DataRecord = {
  species: string;
  island: string;
  beakLength: number | undefined;
  beakDepth: number | undefined;
  flipperLength: number | undefined;
  bodyMass: number | undefined;
  sex: string;
};

/**
 * Configuration for bubble sizes.
 */
export interface SizeOptions {
  minRadius?: number; // Minimum radius for a bubble
  maxRadius?: number; // Maximum radius for a bubble
  // scale?: 'linear' | 'sqrt' | 'log'; // Simplified, default to sqrt logic in component
}

export interface BubbleChartProps<T> {
  /**
   * The data to be displayed in the bubble chart.
   * Each element of the array represents a data point.
   * The structure of 'T' should be compatible with the chart's rendering logic.
   */
  data: T[];
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * The height of the chart in pixels.
   */
  height: number;
  /**
   * Optional label for the x-axis.
   */
  xLabel?: string;
  /**
   * Optional label for the y-axis.
   */
  yLabel?: string;
  /**
   * Optional padding applied to the chart.
   * Allows specifying individual padding values for the top, right, bottom, and left sides.
   */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /**
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories: Record<string, BulletLegendItemInterface>;
  /**
   * @param {number|Date} tick - The value of the tick. This can be a number or a Date object depending on the scale of the x-axis.
   * @param {number} i - The index of the tick in the `ticks` array.
   * @param {(number[]|Date[])} ticks - An array of all tick values for the x-axis.
   * @returns {string} The formatted string representation of the tick.
   */
  xFormatter?: axisFormatter;
  /**
   * @param {number|Date} tick - The value of the tick. This can be a number or a Date object depending on the scale of the y-axis.
   * @param {number} i - The index of the tick in the `ticks` array.
   * @param {(number[]|Date[])} ticks - An array of all tick values for the y-axis.
   * @returns {string} The formatted string representation of the tick.
   */
  yFormatter?: axisFormatter;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   */
  legendPosition?: LegendPosition;
  /** Options for controlling bubble sizes. */
  sizeOptions?: SizeOptions;
  /**
   * If `true`, displays a domain line (axis line) along the x-axis.
   */
  xDomainLine?: boolean;
  /**
   * If `true`, displays a domain line (axis line) along the y-axis.
   */
  yDomainLine?: boolean;
  /**
   * If `true`, displays tick lines on the x-axis.
   */
  xTickLine?: boolean;
  /**
   * If `true`, displays tick lines on the y-axis.
   */
  yTickLine?: boolean;
  /**
   * If `true`, displays grid lines along the x-axis.
   */
  xGridLine?: boolean;
  /**
   * If `true`, displays grid lines along the y-axis.
   */
  yGridLine?: boolean;
  /**
   * If `true`, hide the x-axis.
   */
  hideXAxis?: boolean;
  /**
   * If `true`, hide the y-axis.
   */
  hideYAxis?: boolean;
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * The desired number of ticks on the y-axis.
   */
  yNumTicks?: number;
}
