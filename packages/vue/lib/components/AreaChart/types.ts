import { axisFormatter, CrosshairConfig, LegendPosition, MarkerConfig, AxisConfig } from "../../types";
import type { BulletLegendItemInterface, CurveType } from "@unovis/ts";

export interface AreaChartProps<T> {
  /**
   * The data to be displayed in the area chart.
   * Each element of the array represents a data point.
   * The structure of 'T' should be compatible with the chart's rendering logic.
   */
  data: T[];
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
   * A record mapping marker keys to show custom patterns.
   */
  markerConfig?: MarkerConfig;
  /**
   * A function that formats the x-axis tick labels.
   */
  xFormatter?: axisFormatter;
  /**
   * A function that formats the y-axis tick labels.
   */
  yFormatter?: axisFormatter;
  /**
   * The type of curve to use for the area chart lines.
   * See `CurveType` for available options.
   */
  curveType?: CurveType;
  /**
   * If `true`, hides the area fill, displaying only the line.
   */
  hideArea?: boolean;
  /**
   * Edit the gradient stops for the area fill.
   */
  gradientStops?: Array<{ offset: string; stopOpacity: number }>;
  /**
   * The width of the line in pixels. Default is 2px.
   */
  lineWidth?: number;
  /**
   * Line dash array, see SVG's stroke-dasharray. Default: `undefined`
   */
  lineDashArray?: number[][];
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * Force specific ticks on the x-axis.
   */
  xExplicitTicks?: (number | string | Date)[];
  /**
   * Force only first and last ticks on the x-axis.
   */
  minMaxTicksOnly?: boolean;
  /**
   * The desired number of ticks on the y-axis.
   */
  yNumTicks?: number;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * If `true`, hides the chart tooltip.
   */
  hideTooltip?: boolean;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   */
  legendPosition?: LegendPosition;
  /**
   * Optional style object for the legend container. Allows custom CSS styling.
   */
  legendStyle?: string | Record<string, string>;
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
   * The domain for the y-axis, specified as a tuple of two values.
   */
  yDomain?: [number | undefined, number | undefined];
  /**
   * The domain for the x-axis, specified as a tuple of two values.
   */
  xDomain?: [number | undefined, number | undefined];
}
