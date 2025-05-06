<script setup lang="ts">
const categories: Record<string, BulletLegendItemInterface> = {
  accuracy: { name: 'Accuracy', color: '#22c55e' },
};

const metricData = [
  {
    date: 'Feb 24',
    accuracy: 50,
  },
  {
    date: 'Feb 24',
    accuracy: 60,
  },
  {
    date: 'Mar 24',
    accuracy: 50,
  },
  {
    date: 'May 24',
    accuracy: 70,
  },
  {
    date: 'May 24',
    accuracy: 60,
  },
];
</script>

<template>
  <div class="py-4">
    <AreaChart
    :data="metricData"
    :categories="categories"
    :min-max-ticks-only="true"
    :y-num-ticks="10"
    :x-formatter="(i: number) => ``"
    :y-formatter="(i) => ''"
    :hide-legend="true"
  />
  </div>
</template>

<style>
:root {
    --vis-tooltip-padding: 50px
}
</style>