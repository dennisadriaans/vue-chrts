export enum CalendarSelectionMode {
  Single = 'single',
  Range = 'range',
  Multiple = 'multiple'
}

export enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}

export type CalendarProps = {
  selectionMode?: CalendarSelectionMode
  initialDate?: Date
  initialStartDate?: Date
  initialEndDate?: Date
  showTimePicker?: boolean
  timeSlots?: string[]
  initialTime?: string
  dateFormat?: string
  timeFormat?: string
  weekDayLabels?: [string, string, string, string, string, string, string]
  orientation?: Orientation
  visibleMonths?: number
  locale?: string
  disabledDates?: Date[]
  minDate?: Date
  maxDate?: Date
  classNames?: {
    container?: string
    header?: string
    weekdays?: string
    day?: string
    today?: string
    selected?: string
    disabled?: string
    inRange?: string
  }
}
