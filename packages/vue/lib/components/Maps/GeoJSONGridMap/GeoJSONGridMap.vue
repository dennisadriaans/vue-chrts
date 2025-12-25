<script lang="ts" setup>
import { computed } from "vue";
import { VisXYContainer, VisScatter } from "@unovis/vue";
import { geoJsonToGrid, type GridPoint } from "../../../src/utils/geoJsonToGrid";
import europeGeoJSON from "../../../src/data/europe.geojson";

const props = withDefaults(defineProps<{
  height?: string | number;
  dotSize?: number;
  color?: string;
  backgroundColor?: string;
  gridSize?: number;
  gridType?: 'square' | 'hex';
}>(), {
  height: "600px",
  dotSize: 1,
  color: "#4f46e5",
  backgroundColor: "transparent",
  gridSize: 80,
  gridType: 'square',
});

// Convert GeoJSON to grid points
const gridPoints = computed<GridPoint[]>(() => {
  try {
    return geoJsonToGrid(europeGeoJSON, props.gridSize, props.gridType);
  } catch (e) {
    console.error("Error converting GeoJSON to grid:", e);
    return [];
  }
});

// Unovis Scatter data
const data = computed(() => gridPoints.value);

const x = (d: GridPoint) => d.x;
const y = (d: GridPoint) => d.y;
</script>

<template>
  <VisXYContainer
    :data="data"
    :height="height"
    :padding="{ top: 10, bottom: 10, left: 10, right: 10 }"
  >
    <VisScatter
      :x="x"
      :y="y"
      :size="dotSize"
      :color="color"
    />
  </VisXYContainer>
</template>
