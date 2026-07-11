<script lang="ts" setup>
const cards = [
  {
    id: 'line-charts',
    fig: 'FIG 0.1',
    title: 'Line Charts',
    text: 'Visualize trends and changes over time with elegant, interactive line charts—perfect for analytics and reporting.'
  },
  {
    id: 'bar-charts',
    fig: 'FIG 0.2',
    title: 'Bar Charts',
    text: 'Compare categories and visualize distributions with interactive bar charts—ideal for summaries and breakdowns.'
  },
  {
    id: 'area-charts',
    fig: 'FIG 0.3',
    title: 'Area Charts',
    text: 'Show totals and highlight magnitude with smooth area charts. Great for visualizing stacked data and trends.'
  },
  {
    id: 'donut-charts',
    fig: 'FIG 0.4',
    title: 'Donut Charts',
    text: 'Display proportions and breakdowns with visually engaging donut charts. Ideal for showing parts of a whole.'
  }
]
</script>

<template>
  <div class="border-default overflow-hidden rounded-xl border">
    <div class="bg-default/10 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="card in cards"
        :key="card.id"
        :to="`/blocks/${card.id}`"
        class="bg-default hover:bg-elevated/20 block transition-colors duration-300"
      >
        <HomeChartCard v-bind="card">
          <HomeIllustrationsLineChart v-if="card.id === 'line-charts'" />
          <HomeIllustrationsBarChart v-else-if="card.id === 'bar-charts'" />
          <HomeIllustrationsAreaChart v-else-if="card.id === 'area-charts'" />
          <HomeIllustrationsDonutChart v-else-if="card.id === 'donut-charts'" />
        </HomeChartCard>
      </NuxtLink>
    </div>
  </div>
</template>
