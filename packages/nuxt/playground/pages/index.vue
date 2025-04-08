<script lang="ts" setup>
import type { BulletLegendItemInterface } from "vue-chrts";

interface AreaChartItem {
  month: string;
  desktop: number;
}

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#00dc82" },
};

const AreaChartData: AreaChartItem[] = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const xFormatter = (i: number): string | number => `${AreaChartData[i]?.month}`;
</script>
<template>
  <TestComponent
    :data="AreaChartData"
    :height="275"
    :x-label="'test'"
    :categories="categories"
    :y-num-ticks="4"
    :x-num-ticks="7"
    :grid-line-y="true"
    :legend-poisition="'top'"
    :x-formatter="xFormatter"
  ></TestComponent>
</template>
