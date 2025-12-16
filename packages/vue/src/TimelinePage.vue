<script lang="ts" setup>
import { BulletLegendItemInterface, Timeline } from "../lib";
import Card from "./elements/Card.vue";
import { data, TimelineItem, ProductType } from "./data/TimelineData";

// Accessor functions for the timeline
const x = (d: TimelineItem) => d.startDate;
const length = (d: TimelineItem) => d.endDate - d.startDate;
const type = (d: TimelineItem) => d.name;

// Legend items based on ProductType enum
const categories: Record<string, BulletLegendItemInterface> = {
  [ProductType.Frontend]: { name: ProductType.Frontend, color: 'var(--color-orange-400)' },
  [ProductType.Backend]: { name: ProductType.Backend, color: 'var(--color-blue-400)' },
  [ProductType.UX]: { name: ProductType.UX, color: 'var(--color-yellow-400)' }
}

const timelineExamples = [
  {
    id: 1,
    data: data,
    height: 600,
    showLabels: true,
    labelWidth: 220,
    hideLegend: false,
  },
];

</script>

<template>
  <div class="space-y-12 pb-24 pt-8 max-w-screen-2xl mx-auto">
    <div class="mb-8 text-left mt-4 space-y-2">
      <h1 class="text-3xl font-bold">Timeline Examples</h1>
      <p class="text-lg dark:text-neutral-400 text-neutral-600">
        Explore different Timeline Chart configurations to visualize temporal
        data and project schedules.
      </p>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <div class="grid grid-cols-1 gap-8 items-stretch">
        <Card
          v-for="(example, exampleKey) in timelineExamples"
          :key="exampleKey"
          class="p-4 relative"
        >
        <h2 class="text-xl font-semibold absolute">Sprint Planning </h2>
          <Timeline
            :data="example.data"
            :showLabels="example.showLabels"
            :labelWidth="example.labelWidth"
            :x="x"
            :length="length"
            :type="type"
            :categories="categories"
          >

          <template #labelTooltip="{ values }">
            <div class="p-2">
              {{  values?.label  }}
            </div>
          </template>
        </Timeline>
        </Card>
      </div>
    </div>
  </div>
</template>
