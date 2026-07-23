import type { SparklineType } from '../Sparkline/types'

export type TrendDirection = 'up' | 'down' | 'neutral'

export interface StatTileTrend {
  /** Formatted delta, e.g. "+12.5%". */
  value: string
  /** Controls the color and default icon. */
  direction: TrendDirection
}

export interface StatTileProps {
  /** Metric label, e.g. "Monthly revenue". */
  label: string
  /** Primary value. Digits animate via RollingNumber when `animate` is set. */
  value: string | number
  /** Optional prefix rendered before the value, e.g. "$". */
  prefix?: string
  /** Optional suffix rendered after the value, e.g. "k". */
  suffix?: string
  /** Optional trend / delta badge. */
  trend?: StatTileTrend
  /** Secondary caption under the trend, e.g. "vs. last month". */
  caption?: string
  /** Optional leading icon (Iconify name). */
  icon?: string
  /** Optional sparkline series rendered in the tile. */
  sparkline?: number[]
  /** Sparkline rendering style. */
  sparklineType?: SparklineType
  /** Color for the sparkline. Defaults to a trend-aware color. */
  color?: string
  /** Animate the numeric value with a rolling effect. */
  animate?: boolean
}
