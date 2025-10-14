export interface TimelineLegendItem {
  name: string
  color: string
}

export interface TimelineProps<T extends Record<string, any>> {
  data: T[]
  labelWidth?: number
  height?: number
  title?: string
  legendItems?: TimelineLegendItem[]
  x: (d: T) => number
  length: (d: T) => number
  type: (d: T) => string
  color: (d: T) => string
  getTooltipText?: (label: string, index: number, data: T[]) => string
  dateFormatter?: (date: number) => string
  showLabels?: boolean
}
