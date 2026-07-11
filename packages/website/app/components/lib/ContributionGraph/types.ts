export interface ContributionDay {
  /** ISO date string (YYYY-MM-DD). */
  date: string
  /** Value for that day. */
  count: number
}

export interface ContributionGraphProps {
  /** Sparse list of day → count. Missing days are treated as 0. */
  data: ContributionDay[]
  /** Number of intensity buckets (excluding the empty state). */
  levels?: number
  /** Base color for the highest intensity; lower levels are faded from it. */
  color?: string
  /** Size of each day cell in pixels. */
  cellSize?: number
  /** Gap between cells in pixels. */
  cellGap?: number
  /** Radius of each day cell in pixels. */
  cellRadius?: number
  /** Show the weekday labels column (Mon / Wed / Fri). */
  showWeekdayLabels?: boolean
  /** Show the month labels row. */
  showMonthLabels?: boolean
  /** Show the Less → More legend. */
  showLegend?: boolean
  /** Explicit upper bound for the color scale (defaults to the data max). */
  maxCount?: number
  /** Formats the tooltip text for a day. */
  tooltipFormatter?: (day: { date: string, count: number }) => string
}
