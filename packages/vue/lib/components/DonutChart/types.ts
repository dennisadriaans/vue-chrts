export type DonutChartProps = {
  /**
   * The type of donut chart to render.
   * See `DonutType` for available options.
   */
  type?: string;
  /**
   * The data to be displayed in the donut chart.
   * Each number in the array represents a segment value.
   */
  data: number[];
  /**
   * The height of the chart in pixels.
   */
  height: number;
  /**
   * The radius of the donut in pixels.
   */
  radius: number;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * An array of label objects defining the name and color for each segment.
   */
  labels: {
    name: string;
    color: string;
  }[];

  /**
   * Pad angle. Default: 0
   */
  padAngle?: number
  /**
   * Crosshair configuration object for customizing the appearance of the crosshair line.
   */
  crosshairConfig?: {
    /**
     * The color of the crosshair line. Accepts any valid CSS color string.
     * Example: '#f00', 'rgba(0,0,0,0.5)', 'blue'
     */
    color?: string;
    /**
     * The stroke color of the crosshair line. Accepts any valid CSS color string.
     */
    strokeColor?: string;
    /**
     * The stroke width of the crosshair line in pixels.
     */
    strokeWidth?: number;
  };
};

enum DonutType {
  Half = "half",
  Full = "full",
}

export { DonutType };