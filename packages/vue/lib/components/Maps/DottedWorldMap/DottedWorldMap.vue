<script setup lang="ts">
import { computed } from "vue";
import { VisXYContainer, VisScatter } from "@unovis/vue";
import DottedMapPkg from "dotted-map";

const DottedMap = (DottedMapPkg as any).default || DottedMapPkg;

const props = withDefaults(defineProps<{
  height?: string | number;
  dotSize?: number;
  color?: string;
  mapHeight?: number;
  backgroundColor?: string;
}>(), {
  height: "600px",
  dotSize: 0.5,
  color: "#ffffff",
  mapHeight: 100,
  backgroundColor: "#0f172a",
});

// Initialize the dotted map
const mapPoints = computed<Array<{ x: number; y: number }>>(() => {
  try {
    const map = new DottedMap({ height: props.mapHeight, grid: "vertical" });
    return map.getPoints();
  } catch (e) {
    console.error("Error initializing DottedMap:", e);
    return [];
  }
});

// Unovis Scatter data
const data = computed(() => mapPoints.value);

const maxY = computed(() => {
  let currentMax = 0;
  for (const point of data.value) {
    if (point.y > currentMax) currentMax = point.y;
  }
  return currentMax;
});

const x = (d: { x: number; y: number }) => d.x;
// dotted-map's coordinates follow SVG convention (y grows downward). Unovis charts
// assume y grows upward, so invert y to keep the map visually correct.
const y = (d: { x: number; y: number }) => maxY.value - d.y;
</script>

<template>
   <VisXYContainer
      :data="data"
      :height="height"
      :padding="{ top: 10, bottom: 10, left: 10, right: 10 }"
      :scaleByDomain="true"
    >
      <VisScatter
        :x="x"
        :y="y"
        :size="dotSize"
        :color="color"
      />
    </VisXYContainer>
</template>

