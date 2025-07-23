<script lang="ts" setup>

const chartData = [
  {
    date: 'Jan 23',
    subscriptions: 2890,
    downloads: 2338,
  },
  {
    date: 'Feb 23',
    subscriptions: 2756,
    downloads: 2103,
  },
  {
    date: 'Mar 23',
    subscriptions: 3322,
    downloads: 2194,
  },
  {
    date: 'Apr 23',
    subscriptions: 3470,
    downloads: 2108,
  },
  {
    date: 'May 23',
    subscriptions: 3475,
    downloads: 1812,
  },
  {
    date: 'Jun 23',
    subscriptions: 3129,
    downloads: 1726,
  },
  {
    date: 'Jul 23',
    subscriptions: 3490,
    downloads: 1982,
  },
  {
    date: 'Aug 23',
    subscriptions: 2903,
    downloads: 2012,
  },
  {
    date: 'Sep 23',
    subscriptions: 2643,
    downloads: 2342,
  },
  {
    date: 'Oct 23',
    subscriptions: 2837,
    downloads: 2473,
  },
  {
    date: 'Nov 23',
    subscriptions: 2954,
    downloads: 3848,
  },
  {
    date: 'Dec 23',
    subscriptions: 3239,
    downloads: 3736,
  },
]

const categories: Record<string, BulletLegendItemInterface> = {
  subscriptions: { name: 'Subscriptions', color: '#3b82f6' },
  downloads: { name: 'Downloads', color: '#22c55e' },
}

const xFormatter = (i: number): string | number => `${chartData[i]?.date}`

</script>
<template>
  <ClientOnly>
    <LineChart
    :data="chartData"
    :height="300"
    y-label="Sales"
    :x-num-ticks="4"
    :y-num-ticks="4"
    :categories="categories"
    :x-formatter="xFormatter"
    :y-grid-line="true"
    :curve-type="CurveType.Linear"
    :hide-legend="false"
  />
  </ClientOnly>
</template>
