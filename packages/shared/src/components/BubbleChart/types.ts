import {
  axisFormatter,
  BulletLegendItemInterface,
  LegendPosition,
  CrosshairConfig,
  AxisConfig,
  TooltipConfig,
} from "../../types";

export interface SizeOptions {
  minRadius?: number;
  maxRadius?: number;
}

import type { NumericAccessor, Position } from "@unovis/ts";

export interface BubbleChartProps<T> {
  /**
   * Accessor for x value (index, property, etc). If not provided, defaults to d.beakLength.
   */
  xAccessor?: NumericAccessor<T>;
  /**
   * Accessor for y value. If not provided, defaults to d.flipperLength.
   */
  yAccessor?: NumericAccessor<T>;
  /**
   * Accessor for bubble size. If not provided, defaults to 1.
   */
  sizeAccessor?: NumericAccessor<T>;
  /**
   * Label position for bubbles (default: Position.Bottom)
   */
  labelPosition?: Position;
  /**
   * Range for bubble sizes (default: [1, 20])
   */
  sizeRange?: [number, number];
  /**
   * Opacity for bubbles
   */
  opacity?: number;
  /**
   * Explicit tick values for x axis
   */
  xExplicitTicks?: (number | string | Date)[];
  /**
   * Only show min/max ticks for x axis
   */
  minMaxTicksOnly?: boolean;
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
   * REQUIRED: Each unique value in your data's categoryKey field must have a corresponding entry with a color.
   */
  categories: Record<string, BulletLegendItemInterface>;
  categoryKey: keyof T; // Key to access category in data
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
   * Use custom formatter for tooltip titles
   */
  tooltipTitleFormatter?: (data: T) => string | number;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   */
  legendPosition?: LegendPosition;
  /**
   * Optional inline CSS styles for the legend container.
   */
  legendStyle?: Record<string, string>;
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
  /**
   * If `true`, hides the tooltip.
   */
  hideTooltip?: boolean;
  /**
   * Crosshair configuration object for customizing the appearance of the crosshair line.
   */
  crosshairConfig?: CrosshairConfig;
  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  xAxisConfig?: AxisConfig;
  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  yAxisConfig?: AxisConfig;
  /**
   * Animation duration in milliseconds for the chart components.
   */
  duration?: number;
  /**
   * Configuration object for the chart tooltip.
   */
  tooltip?: TooltipConfig;
}
