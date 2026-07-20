<script setup lang="ts">
interface ChartCard {
  id: string
  title: string
  description: string
}

const cards: ChartCard[] = [
  {
    id: 'area-chart-preview',
    title: 'Area Chart Preview',
    description: 'Desktop and mobile traffic stacked across six months, with a running total above the chart.'
  },
  {
    id: 'bar-chart-one',
    title: 'Bar Chart One',
    description: 'Monthly spend as a single bar series. The simplest way to show one metric over time.'
  },
  {
    id: 'linecharts-chart-one',
    title: 'Line Chart One',
    description: 'Income against expense across the year, so the gap between the two lines reads at a glance.'
  },
  {
    id: 'with-radius-and-spacing',
    title: 'Radius and Spacing',
    description: 'A donut tuned through theme tokens. Adjust corner radius and segment spacing without touching the chart.'
  },
  {
    id: 'bar-chart-two',
    title: 'Bar Chart Two',
    description: 'Daily income and expense side by side over twelve days, grouped per day for direct comparison.'
  },
  {
    id: 'area-chart-one',
    title: 'Area Chart One',
    description: 'This year\'s revenue layered over last year\'s, with currency formatting on every axis and tooltip.'
  },
  {
    id: 'date-picker',
    title: 'Date Picker',
    description: 'A range calendar in a dropdown, with quick presets for today, last 7 days, and last 30 days.'
  },
  {
    id: 'linecharts-chart-two',
    title: 'Line Chart Two',
    description: 'Actual against target budget, with controls to switch the range and swap the curve type live.'
  },
  {
    id: 'expense-budget-cards',
    title: 'Expense Budget Cards',
    description: 'Spend against budget per category, each card carrying its own trend and remaining balance.'
  },
  {
    id: 'interactive-monochrome',
    title: 'Interactive Monochrome',
    description: 'A donut split by device that reshuffles on demand, showing how the chart handles changing data.'
  },
  {
    id: 'tracker',
    title: 'Tracker',
    description: 'Ninety days of uptime as one bar per day, with outages standing out against the operational run.'
  },
  {
    id: 'cards-with-mini-charts',
    title: 'Cards with Mini Charts',
    description: 'Stat cards that carry a small chart inline, pairing the headline number with its recent shape.'
  },
  {
    id: 'donut-chart-one',
    title: 'Donut Chart One',
    description: 'System load split across CPU, memory, and network, with a legend listing each share.'
  },
  {
    id: 'area-chart-data',
    title: 'Area Chart Data',
    description: 'Quarterly revenue split by subscriptions, services, and products, stacked into one running total.'
  },
  {
    id: 'donut-chart-three',
    title: 'Donut Chart Three',
    description: 'Expenses by category with a period selector, so the same donut covers any window you pick.'
  },
  {
    id: 'linecharts-sales',
    title: 'Sales Volume',
    description: 'Sales volume across the first half of the year, with values shortened to thousands on the axis.'
  },
  {
    id: 'cards-with-progress-circle',
    title: 'Cards with Progress Circle',
    description: 'Progress toward a goal as a ring, for quotas and limits where the share matters more than the total.'
  },
  {
    id: 'ai-chat-interface',
    title: 'AI Chat Interface',
    description: 'A full chat layout with conversation list, streaming replies, and collapsible reasoning steps.'
  },
  {
    id: 'developer-salaries',
    title: 'Developer Salaries',
    description: 'Salary ranges compared across roles, using horizontal bars to keep long labels readable.'
  },
  {
    id: 'cards-with-area-chart',
    title: 'Cards with Area Chart',
    description: 'A metric card with a full area chart underneath, for when the trend deserves more than a sparkline.'
  },
  {
    id: 'contribution-graph',
    title: 'Contribution Graph',
    description: 'A year of daily activity on a calendar grid, shaded by volume and sized to fit its container.'
  },
  {
    id: 'default-cards',
    title: 'Default Cards',
    description: 'A metric, its value, and the change since last period. The baseline card the others build on.'
  }
]
</script>

<template>
  <div class="max-w-7xl mx-auto flex items-center justify-between mt-36 gap-32">
    <h2 class="text-5xl font-semibold text-pretty">123</h2>
    <p class="text-muted dark:text-dimmed text-2xl text-pretty">
      Subscriptions, usage, seats, credits, trials, and discounts. Compose them
      however your product charges.
    </p>
  </div>

  <div class="max-w-7xl mx-auto grid grid-cols-3 my-16 gap-8">
    <UCard
      v-for="card in cards"
      :key="card.id"
    >
      <div class="space-y-1">
        <h3 class="text-highlighted mt-4 text-base font-semibold tracking-tight">{{ card.title }}</h3>
        <p class="text-muted dark:text-dimmed mt-2 text-sm leading-relaxed text-pretty">
          {{ card.description }}
        </p>
      </div>
    </UCard>
  </div>
</template>
