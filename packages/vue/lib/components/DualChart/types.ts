import type { LineChartProps } from '../LineChart/props'
import type { AreaChartProps } from '../AreaChart/props'

export interface DualChartProps extends LineChartProps {
  /**
   * Type of the secondary series. Defaults are handled in the component.
   */
  secondaryType?: 'line' | 'area'

  /**
   * The secondary data series.
   */
  secondaryData: any[]

  /**
   * Optional custom formatter for secondary values.
   */
  secondaryFormatter?: (value: any) => string

  /**
   * Optional color for the secondary series.
   */
  secondaryColor?: string

  /**
   * Optional label for the secondary series.
   */
  secondaryLabel?: string

  /**
   * Optional Y-axis domain for secondary axis.
   */
  secondaryDomain?: [number, number]

  /**
   * Optional key for secondary values in data objects.
   */
  secondaryKey?: string

  /**
   * Optional key for x-values in data objects.
   */
  xKey?: string

  /**
   * Optional id for secondary series.
   */
  secondaryId?: string

  /**
   * Optional stroke width for secondary series.
   */
  secondaryStrokeWidth?: number

  /**
   * Optional opacity for secondary series.
   */
  secondaryOpacity?: number

  /**
   * Optional settings for the secondary area series (mirrors AreaChartProps).
   * Only applies when secondaryType is 'area'.
   */
  hideArea?: AreaChartProps['hideArea']
  gradientStops?: AreaChartProps['gradientStops']
  markerConfig?: AreaChartProps['markerConfig']
  lineDashArray?: AreaChartProps['lineDashArray']
}
