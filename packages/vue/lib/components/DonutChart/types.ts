interface DonutChartProps {
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
};

enum DonutType {
  Half = "half",
  Full = "full",
}

export { type DonutChartProps, DonutType };