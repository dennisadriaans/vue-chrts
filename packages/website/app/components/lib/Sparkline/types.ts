export type SparklineType = 'line' | 'area' | 'bar'

export interface SparklineProps {
  /** The series of numeric values to plot. */
  data: number[]
  /** Rendering style of the sparkline. */
  type?: SparklineType
  /** Stroke / fill color. Accepts any CSS color or CSS variable. */
  color?: string
  /** Width of the SVG viewport in pixels. */
  width?: number
  /** Height of the SVG viewport in pixels. */
  height?: number
  /** Stroke width for line / area variants. */
  strokeWidth?: number
  /** Show a filled gradient below the line (line variant only). */
  showArea?: boolean
  /** Render a marker dot on the last data point. */
  showLastPoint?: boolean
  /** Force a minimum for the value scale (defaults to data min). */
  min?: number
  /** Force a maximum for the value scale (defaults to data max). */
  max?: number
}
