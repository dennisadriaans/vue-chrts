import type { BulletLegendItemInterface } from "@unovis/ts"

export interface IncomeExpenseItem {
  month: string
  year: number
  income: {
    salary: number
    sideHustle: number
    total: number
  }
  expenses: {
    rent: number
    groceries: number
    utilities: number
    transportation: number
    entertainment: number
    eatingOut: number
    other: number
    total: number
  }
}


export const categories: Record<string, BulletLegendItemInterface> = {
  income: { name: 'Income', color: '#10b981' },
  expenses: { name: 'Expenses', color: '#3b82f6' }
}

export const IncomeExpenseData: IncomeExpenseItem[] = [
  {
    month: 'January',
    year: 2024,
    income: {
      salary: 2000,
      sideHustle: 200,
      total: 2200
    },
    expenses: {
      rent: 1500,
      groceries: 400,
      utilities: 200,
      transportation: 150,
      entertainment: 300,
      eatingOut: 250,
      other: 100,
      total: 2900
    }

  },
  {
    month: 'February',
    year: 2024,
    income: {
      salary: 4000,
      sideHustle: 100,
      total: 4100
    },
    expenses: {
      rent: 1500,
      groceries: 450,
      utilities: 250,
      transportation: 150,
      entertainment: 200,
      eatingOut: 300,
      other: 150,
      total: 3000
    }

  },
  {
    month: 'March',
    year: 2024,
    income: {
      salary: 2000,
      sideHustle: 100,
      total: 2100
    },
    expenses: {
      rent: 1500,
      groceries: 420,
      utilities: 220,
      transportation: 180,
      entertainment: 350,
      eatingOut: 200,
      other: 120,
      total: 2990
    }
  },
  {
    month: 'April',
    year: 2024,
    income: {
      salary: 2300,
      sideHustle: 100,
      total: 2400
    },
    expenses: {
      rent: 1500,
      groceries: 450,
      utilities: 250,
      transportation: 150,
      entertainment: 200,
      eatingOut: 300,
      other: 150,
      total: 1400
    }

  },
  {
    month: 'May',
    year: 2024,
    income: {
      salary: 4000,
      sideHustle: 100,
      total: 4100
    },
    expenses: {
      rent: 1500,
      groceries: 450,
      utilities: 250,
      transportation: 150,
      entertainment: 200,
      eatingOut: 300,
      other: 150,
      total: 3000
    }

  },
  {
    month: 'Jun',
    year: 2024,
    income: {
      salary: 3000,
      sideHustle: 100,
      total: 3100
    },
    expenses: {
      rent: 1500,
      groceries: 450,
      utilities: 250,
      transportation: 150,
      entertainment: 200,
      eatingOut: 300,
      other: 150,
      total: 3000
    }

  },
  {
    month: 'Jul',
    year: 2024,
    income: {
      salary: 3200,
      sideHustle: 600,
      total: 3800
    },
    expenses: {
      rent: 1500,
      groceries: 450,
      utilities: 250,
      transportation: 150,
      entertainment: 200,
      eatingOut: 300,
      other: 150,
      total: 3000
    }

  },
  {
    month: 'Aug',
    year: 2024,
    income: {
      salary: 3000,
      sideHustle: 100,
      total: 3100
    },
    expenses: {
      rent: 1500,
      groceries: 450,
      utilities: 250,
      transportation: 150,
      entertainment: 200,
      eatingOut: 300,
      other: 150,
      total: 2000
    }

  }
]
