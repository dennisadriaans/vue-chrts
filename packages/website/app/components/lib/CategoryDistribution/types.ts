type TrendIndicator = {
  value: string
  direction: 'up' | 'down' | 'neutral'
}

export type CategoryDistributionCategoryItem = {
  label: string
  percentage: number
  color: string
  value?: number | string
}

export type CategoryDistributionProps = {
  primaryValue: string | number
  categories: CategoryDistributionCategoryItem[]
  trend?: TrendIndicator
  legendClass?: string
  gap?: 'sm' | 'lg' | 'xl'
}
