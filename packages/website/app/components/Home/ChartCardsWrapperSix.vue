<script lang="ts" setup>
const cards = [
  {
    id: 'line-charts',
    fig: '01',
    title: 'Line Charts',
    text: 'Visualize trends and changes over time with elegant, interactive line charts—perfect for analytics and reporting.'
  },
  {
    id: 'bar-charts',
    fig: '02',
    title: 'Bar Charts',
    text: 'Compare categories and visualize distributions with interactive bar charts—ideal for summaries and breakdowns.'
  },
  {
    id: 'area-charts',
    fig: '03',
    title: 'Area Charts',
    text: 'Show totals and highlight magnitude with smooth area charts. Great for visualizing stacked data and trends.'
  },
  {
    id: 'donut-charts',
    fig: '04',
    title: 'Donut Charts',
    text: 'Display proportions and breakdowns with visually engaging donut charts. Ideal for showing parts of a whole.'
  }
]
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4 border border-default bg-muted">
      <NuxtLink
        v-for="card in cards"
        :key="card.id"
        :to="`/blocks/${card.id}`"
        class="bg-default"
      >
        <HomeChartCard v-bind="card">
          <HomeIllustrationsLineChartSix v-if="card.id === 'line-charts'" />
          <HomeIllustrationsBarChartSix v-else-if="card.id === 'bar-charts'" />
          <HomeIllustrationsAreaChartSix v-else-if="card.id === 'area-charts'" />
          <HomeIllustrationsDonutChartSix v-else-if="card.id === 'donut-charts'" />
        </HomeChartCard>
      </NuxtLink>
    </div>
  </div>
</template>
