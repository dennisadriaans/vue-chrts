<script lang="ts" setup>
import { computed } from "vue";
import { VisXYContainer, VisScatter } from "@unovis/vue";
import { geoPath, geoAzimuthalEqualArea, geoContains } from 'd3-geo';

interface GridPoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

const props = withDefaults(defineProps<{
  geoJson: any; // GeoJSON FeatureCollection
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
function geoJsonToGrid(
  geoJson: any,
  gridSize: number,
  gridType: 'square' | 'hex'
): GridPoint[] {
  if (!geoJson || !geoJson.features) {
    return [];
  }

  // Create a projection centered on Europe
  const projection = geoAzimuthalEqualArea()
    .rotate([-20, -52]) // Center on Europe
    .scale(800)
    .translate([400, 400]);

  const path = geoPath().projection(projection);

  // Calculate bounding box
  const bounds = path.bounds(geoJson);
  const [[x0, y0], [x1, y1]] = bounds;
  const width = x1 - x0;
  const height = y1 - y0;

  // Calculate grid spacing
  const spacing = height / gridSize;
  const cols = Math.ceil(width / spacing);

  const points: GridPoint[] = [];

  // Generate grid points
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < cols; col++) {
      let x: number, y: number;

      if (gridType === 'hex') {
        // Hexagonal grid (offset every other row)
        const xOffset = row % 2 === 0 ? 0 : spacing / 2;
        x = x0 + col * spacing + xOffset;
        y = y0 + row * spacing * 0.866; // 0.866 ≈ sqrt(3)/2 for hex packing
      } else {
        // Square grid
        x = x0 + col * spacing;
        y = y0 + row * spacing;
      }

      // Get lat/lng from projected coordinates
      const coords = projection.invert!([x, y]);
      if (!coords) continue;

      // Check if point is within any feature using geoContains
      let isInside = false;
      for (const feature of geoJson.features) {
        if (geoContains(feature, coords)) {
          isInside = true;
          break;
        }
      }

      if (isInside) {
        points.push({
          x,
          y,
          lng: coords[0],
          lat: coords[1],
        });
      }
    }
  }

  return points;
}

const gridPoints = computed<GridPoint[]>(() => {
  try {
    return geoJsonToGrid(props.geoJson, props.gridSize, props.gridType);
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
