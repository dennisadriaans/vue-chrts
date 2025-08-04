<script lang="ts" setup>
import {
  BubbleChart,
  BulletLegendItemInterface,
  LegendPosition,
} from "./../lib";
import Card from "./elements/Card.vue";
import { data as bubbleChartData } from "./data/BubbleChartData";

const bubbleCategories: Record<string, BulletLegendItemInterface> = {
  Id: { name: "Id", color: "#b0b0b0" },
};

function formatNumber(tick: number | Date) {
  return typeof tick === "number" ? tick.toLocaleString() : String(tick);
}

const xAccessor = (d: any) => d.createdAt;
const yAccessor = (d: any) => d.timeToTriage;
const sizeAccessor = (d: any) => d.comments;
const colorAccessor = (d: any) => "#f00";
</script>

<template>
  <div class="space-y-4 pb-24 pt-8">
    <div class="max-w-7xl mx-auto">
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Linear Tasks: Time to Triage</h2>
          <p class="text-neutral-400 text-sm">
            Bubble charts visualize three dimensions of data: X, Y, and bubble
            size.
          </p>
        </div>
        <div class="mt-4">
          <BubbleChart
            :data="bubbleChartData"
            :height="400"
            :categories="bubbleCategories"
            :x-accessor="xAccessor"
            :y-accessor="yAccessor"
            :y-grid-line="false"
            :hide-y-axis="true"
            :size-accessor="sizeAccessor"
            :color-accessor="colorAccessor"
            :legend-position="LegendPosition.Bottom"
            :x-formatter="(v) => `Week: ${v}`"
            :y-formatter="formatNumber"
          />
        </div>
      </Card>
    </div>
  </div>
</template>
