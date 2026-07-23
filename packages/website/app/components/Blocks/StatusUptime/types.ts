export enum ContributionGraphSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg'
}

export type Contribution = {
  count: number
  date: string
}

export type GroupedContributions = {
  [week: number]: {
    [dayOfWeek: number]: Contribution
  }
}
