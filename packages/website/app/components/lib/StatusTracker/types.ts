export type Status = 'online' | 'offline' | 'maintenance' | 'empty'

export interface StatusItem {
  status: Status
  label?: string
}

export interface StatusTrackerProps {
  statusData: StatusItem[]
  barWidth?: number
  barGap?: number
}
