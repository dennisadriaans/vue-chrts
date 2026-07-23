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
    id: 'date-picker',
    title: 'Date Picker',
    description: 'A range calendar in a dropdown, with quick presets for today, last 7 days, and last 30 days.'
  },
  {
    id: 'linecharts-chart-two',
    title: 'Line Chart Two',
    description: 'A smooth weekly series with hollow markers and a dashed grid, so each point and trend read clearly.'
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
  <div class="max-w-7xl mx-auto flex items-center justify-between mt-36 gap-32 px-4">
    <h2 class="text-5xl font-semibold text-pretty">123</h2>
    <p class="text-muted dark:text-dimmed text-2xl text-pretty">
      Subscriptions, usage, seats, credits, trials, and discounts. Compose them
      however your product charges.
    </p>
  </div>

  <div class="max-w-7xl mx-auto grid grid-cols-3 my-16 gap-8 px-4">
    <UCard
      v-for="(card, cardKey) in cards"
      :key="cardKey"
    >

      <div class="space-y-1">
        <h3 class="text-highlighted mt-4 text-base font-semibold tracking-tight">{{ card.title }}</h3>
        <p class="text-muted dark:text-dimmed mt-2 text-sm leading-relaxed text-pretty">
          {{ card.description }}
        </p>
      </div>

      <div class="blur-mask-fade px-2 mt-4">
        <template v-if="card.id === 'area-chart-preview'">
          <HomeChartsCardinal />
        </template>
        <template v-else-if="card.id === 'bar-chart-one'">
          <HomeChartsBarExample />
        </template>
        <template v-else-if="card.id === 'linecharts-chart-one'">
          <HomeChartsLineChartSale />
        </template>
        <template v-else-if="card.id === 'with-radius-and-spacing'">
          <HomeChartsDonutSimple />
        </template>
        <template v-else-if="card.id === 'date-picker'">
          <HomeComponentsCalendar />
        </template>
        <template v-else-if="card.id === 'linecharts-chart-two'">
          <HomeChartsLineChartTwo />
        </template>
        <template v-else-if="card.id === 'expense-budget-cards'">
          <HomeComponentsExpenseBudget />
        </template>
        <template v-else-if="card.id === 'interactive-monochrome'">
          <HomeChartsInteractiveMonochrome />
        </template>
        <template v-else-if="card.id === 'tracker'">
          <HomeComponentsTracker /> 
        </template>
        <template v-else-if="card.id === 'donut-chart-one'">
          <HomeChartsDonutOne />
        </template>
        <template v-else-if="card.id === 'area-chart-data'">
          <HomeChartsAreaChartData />
        </template>
        <template v-else-if="card.id === 'linecharts-sales'">
          <HomeChartsSalesVolume />
        </template>
        <template v-else-if="card.id === 'cards-with-progress-circle'">
          <HomeComponentsProgressCircle />
        </template>
        <template v-else-if="card.id === 'contribution-graph'">
          <HomeComponentsContributionGraph />
        </template>
        <template v-else-if="card.id === 'default-cards'">
          <HomeComponentsDefaultCard />
        </template>
      </div>
    </UCard>
  </div>
</template>
