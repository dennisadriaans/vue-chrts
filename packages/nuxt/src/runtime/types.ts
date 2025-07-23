export type axisFormatter
  = | ((tick: number, i?: number, ticks?: number[]) => string)
    | ((tick: Date, i?: number, ticks?: Date[]) => string)

export interface MarkerConfig {
  type?: 'circle' | 'square' | 'triangle' | 'diamond'
  size?: number
  strokeWidth?: number
  color?: string
  strokeColor?: string
}

export enum LegendPosition {
  Top = 'top',
  Bottom = 'bottom',
}
