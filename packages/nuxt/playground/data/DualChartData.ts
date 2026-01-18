export type DualChartDataItem = {
  month: string
  revenue: number
  costs: number
  profit: number
}

export const DualChartData: DualChartDataItem[] = [
  { month: 'January', revenue: 45000, costs: 30000, profit: 15000 },
  { month: 'February', revenue: 52000, costs: 35000, profit: 17000 },
  { month: 'March', revenue: 48000, costs: 32000, profit: 16000 },
  { month: 'April', revenue: 61000, costs: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, costs: 33000, profit: 22000 },
  { month: 'June', revenue: 67000, costs: 40000, profit: 27000 },
  { month: 'July', revenue: 72000, costs: 42000, profit: 30000 },
  { month: 'August', revenue: 68000, costs: 41000, profit: 27000 },
  { month: 'September', revenue: 74000, costs: 43000, profit: 31000 },
  { month: 'October', revenue: 71000, costs: 44000, profit: 27000 },
  { month: 'November', revenue: 79000, costs: 46000, profit: 33000 },
  { month: 'December', revenue: 85000, costs: 48000, profit: 37000 }
]

export const DualChartBarCategories = {
  revenue: { name: 'Revenue', color: '#3b82f6' },
  costs: { name: 'Costs', color: '#ef4444' }
}

export const DualChartLineCategories = {
  profit: { name: 'Profit', color: '#22c55e' }
}

// Example 2: Sales and Target
export type SalesTargetDataItem = {
  quarter: string
  sales: number
  target: number
}

export const SalesTargetData: SalesTargetDataItem[] = [
  { quarter: 'Q1', sales: 120000, target: 100000 },
  { quarter: 'Q2', sales: 145000, target: 130000 },
  { quarter: 'Q3', sales: 138000, target: 140000 },
  { quarter: 'Q4', sales: 162000, target: 150000 }
]

export const SalesTargetBarCategories = {
  sales: { name: 'Actual Sales', color: '#8b5cf6' }
}

export const SalesTargetLineCategories = {
  target: { name: 'Target', color: '#f59e0b' }
}
