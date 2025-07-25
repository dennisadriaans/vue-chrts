<script lang="ts" setup>
import { DonutChart } from "../lib";
const DonutData = [
  {
    color: "#3b82f6",
    name: "Blue",
    value: 50,
  },
  {
    color: "#a855f7",
    name: "Gray",
    value: 20,
  },
  {
    color: "#22c55e",
    name: "Green",
    value: 30,
  },
];
</script>
<template>
  <div class="my-24">
    <DonutChart
    :data="DonutData.map((i) => i.value)"
    :height="275"
    :labels="DonutData"
    :hide-legend="true"
    :pad-angle="0.1"
    :radius="50"
  >
    <div class="absolute text-center">
      <div class="font-semibold">Label</div>
      <div class="text-muted">2 seconds ago</div>
    </div>
  </DonutChart>
  </div>
</template>


<style>
:root {
    --vis-donut-background-color: transparent;
}
</style>