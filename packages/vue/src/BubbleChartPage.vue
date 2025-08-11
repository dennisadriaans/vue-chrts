<script lang="ts" setup>
import { BubbleChart, LegendPosition } from './../lib';
import Card from './elements/Card.vue';
import { data as bubbleChartData } from './data/BubbleChartData';
import { data as bubbleChartData2 } from './data/BubbleChartData2';
import { data as bubbleChartData3 } from './data/BubbleChartData3';

const categories1 = {
  'title': { name: 'title', color: '#f00' },
};

const categories2 = {
  Inbox: { name: 'Inbox', color: '#2196f3' },
  Work: { name: 'Work', color: '#f44336' },
  Personal: { name: 'Personal', color: '#ff9800' },
  Shopping: { name: 'Shopping', color: '#e91e63' },
  Completed: { name: 'Completed', color: '#4caf50' }
};

const categories3 = {
  'Asia': { name: 'Asia', color: '#2196f3' },
  'Europe': { name: 'Europe', color: '#f44336' },
  'Africa': { name: 'Africa', color: '#ff9800' },
  'North America': { name: 'North America', color: '#e91e63' },
  'South America': { name: 'South America', color: '#4caf50' },
  'Oceania': { name: 'Oceania', color: '#00bcd4' },
};

function formatNumber(tick: number | Date): string {
  return typeof tick === 'number' ? tick.toLocaleString() : String(tick);
}

const xAccessor1 = (d: any) => d.createdAt;
const yAccessor1 = (d: any) => d.timeToTriage;
const sizeAccessor1 = (d: any) => d.comments;

const xAccessor2 = (d: any) => d.value;
const yAccessor2 = (d: any) => d.priority;
const sizeAccessor2 = (d: any) => d.size;

const xAccessor3 = (d: any) => d.gdp;
const yAccessor3 = (d: any) => d.lifeExpectancy;
const sizeAccessor3 = (d: any) => d.population;
</script>

<template>
  <div class="space-y-4 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Linear Tasks: Time to Triage</h2>
          <p class="text-neutral-400 text-sm">
            Bubble charts visualize three dimensions of data: X, Y, and bubble size.
          </p>
        </div>
        <div class="mt-4">
          <BubbleChart
            :data="bubbleChartData"
            :height="400"
            :categories="categories1"
            category-key="title"
            :x-accessor="xAccessor1"
            :y-accessor="yAccessor1"
            :y-grid-line="false"
            :hide-y-axis="true"
            :size-accessor="sizeAccessor1"
            :legend-position="LegendPosition.Bottom"
            :x-formatter="(v: number | Date) => `Week: ${v}`"
            :y-formatter="formatNumber"
          />
        </div>
      </Card>
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Priority vs Value (Platform Categories)</h2>
          <p class="text-neutral-400 text-sm">
            Explicit color mapping for each platform category.
          </p>
        </div>
        <div class="mt-4">
          <BubbleChart
            :data="bubbleChartData2"
            :height="400"
            :categories="categories2"
            category-key="platform"
            :x-accessor="xAccessor2"
            :y-accessor="yAccessor2"
            :size-accessor="sizeAccessor2"
            :legend-position="LegendPosition.Top"
            :y-formatter="formatNumber"
            x-label="Value"
            y-label="Priority"
          />
        </div>
      </Card>
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Country GDP, Life Expectancy, and Population</h2>
          <p class="text-neutral-400 text-sm">
            A bubble chart showing the relationship between GDP, life expectancy, and population of different countries, categorized by continent.
          </p>
        </div>
        <div class="mt-4">
          <BubbleChart
            :data="bubbleChartData3"
            :height="600"
            :categories="categories3"
            category-key="continent"
            :x-accessor="xAccessor3"
            :y-accessor="yAccessor3"
            :size-accessor="sizeAccessor3"
            :legend-position="LegendPosition.Top"
            :y-formatter="formatNumber"
            :x-formatter="formatNumber"
            x-label="GDP (in billions)"
            y-label="Life Expectancy"
          />
        </div>
      </Card>
    </div>
  </div>
</template>
