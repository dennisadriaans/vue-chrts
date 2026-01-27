<script lang="ts" setup>
import { DonutChart, LegendPosition } from "./../lib";
import Card from "./elements/Card.vue";
import { DonutChartData, DonutCategories } from "./data/DonutChartData";
import { ref } from "vue";

function handleChartClick(event: MouseEvent, hoverValues: any) {
  console.log("DonutChart clicked", hoverValues);
}

const donutData = ref([35, 25, 20, 15, 5])

const marketShareLabels = {
  'Product A': { name: 'Product A', color: 'var(--ui-primary)' },
  'Product B': { name: 'Product B', color: 'var(--ui-info)' },
  'Product C': { name: 'Product C', color: 'var(--ui-success)' },
  'Product D': { name: 'Product D', color: 'var(--ui-warning)' },
  'Other': { name: 'Other', color: 'var(--ui-error)' }
}
</script>

<template>
  <div class="space-y-8 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-4">
      <div class="mb-8 space-y-4">
        <h1 class="text-4xl font-bold">Donut Chart</h1>
        <p class="text-lg font-medium text-gray-500">
          Donut charts to represent data as parts of a whole.
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 max-w-screen-2xl mx-auto py-4">
      <DonutChart :data="DonutChartData" :height="800" :categories="DonutCategories" :radius="80" :pad-angle="0.5"
        :arc-width="40" :legend-position="LegendPosition.BottomCenter" @click="handleChartClick">
        <div class="text-center">
          <div class="font-semibold">La123123123123bel</div>
          <div class="text-muted">2 seconds ago</div>
        </div>

      </DonutChart>

      <Card>
        <template #header>
          <h2 class="heading-2">Half Donut Chart Example</h2>
        </template>
        <DonutChart :data="donutData" :categories="marketShareLabels" :radius="80" :pad-angle="0.1" :arc-width="20" :legend-position="LegendPosition.BottomCenter">
          <div class="text-center">
            <div class="font-semibold">
              Label
            </div>
            <div class="text-muted">
              2 seconds ago
            </div>
          </div>
        </DonutChart>
      </Card>
    </div>
  </div>
</template>
