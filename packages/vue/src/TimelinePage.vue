<script lang="ts" setup>
import { Timeline } from "../lib";
import Card from "./elements/Card.vue";
import Button from "./elements/Button.vue";
import { ref } from "vue";
import { colorMap, data, DataRecord, ProductType } from "./data/TimelineData";

type PreviewProps = { id: number; title: string; description: string };

// Accessor functions for the timeline
const x = (d: DataRecord) => d.startDate;
const length = (d: DataRecord) => d.endDate - d.startDate;
const type = (d: DataRecord) => d.name;
const color = (d: DataRecord) => colorMap[d.type as ProductType];

// Legend items based on ProductType enum
const legendItems = Object.keys(ProductType).map((key) => ({
  name: key,
  color: colorMap[ProductType[key as keyof typeof ProductType]],
}));

// Date formatter
const dateFormatter = (date: number) => Intl.DateTimeFormat().format(date);

// Tooltip text generator
function getTooltipText(_: string, i: number, chartData: DataRecord[]): string {
  const { startDate, endDate, description } = chartData[i];
  return `
      <div style="width:220px">
        ${[startDate, endDate].map(dateFormatter).join(" - ")}
        ${description || ""}
      </div>`;
}

type TimelineExample = PreviewProps & {
  data: DataRecord[];
  height: number;
  showLabels: boolean;
  labelWidth: number;
};

const timelineExamples: TimelineExample[] = [
  {
    id: 1,
    title: "Google Products Timeline",
    description:
      "Visual representation of abandoned Google products from 1997 to 2022.",
    data: data, // Show first 20 items
    height: 600,
    showLabels: true,
    labelWidth: 220,
    hideLegend: false,
  },
  {
    id: 2,
    title: "Compact Timeline",
    description: "A compact view of selected Google products.",
    data: data.filter((d) => d.type === "app"), // Show first 10 apps
    height: 400,
    showLabels: true,
    labelWidth: 180,
  },
  {
    id: 3,
    title: "Hardware Products",
    description: "Timeline showing only hardware products from Google.",
    data: data.filter((d) => d.type === "hardware"),
    height: 500,
    showLabels: true,
    labelWidth: 200,
  },
];

const scrollDistance = ref(0);

function handleChartClick(event: MouseEvent, values: any) {
  console.log("Timeline clicked", values);
}

function handleScroll(distance: number) {
  scrollDistance.value = distance;
  console.log("Scrolled to:", distance);
}
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
        >
          <div class="flex items-center justify-between">
            <h2 class="heading-2">{{ example.title }}</h2>
            <Button
              color="white"
              class="!bg-neutral-900"
              icon="i-heroicons:arrow-right-20-solid"
              :trailing="true"
              type="outline"
              size="sm"
            >
              View code
            </Button>
          </div>
          <p class="mb-4 text-sm text-neutral-500">{{ example.description }}</p>
          <Timeline
            :data="example.data"
            :showLabels="example.showLabels"
            :labelWidth="example.labelWidth"
            :x="x"
            :length="length"
            :type="type"
            :color="color"
            :legendItems="legendItems"
            :dateFormatter="dateFormatter"
            :getTooltipText="getTooltipText"
          />
        </Card>
      </div>
    </div>
  </div>
</template>
