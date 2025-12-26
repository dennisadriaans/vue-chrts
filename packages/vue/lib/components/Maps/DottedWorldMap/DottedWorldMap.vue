<script setup lang="ts">
import { computed, useSlots } from "vue";
import DottedMapPkg from "dotted-map";
import type { DottedWorldMapProps } from "./types";

const DottedMap = (DottedMapPkg as any).default || DottedMapPkg;

const props = withDefaults(defineProps<DottedWorldMapProps>(), {
  grid: "vertical",
  avoidOuterPins: false,
  color: "#ffffff",
  dotSize: 0.5,
  shape: "circle",
  height: "600px",
});

// Create the map instance
const mapInstance = computed(() => {
  let map;
  if (props.precomputedMap) {
    const mapData =
      typeof props.precomputedMap === "string"
        ? JSON.parse(props.precomputedMap)
        : props.precomputedMap;
    map = new DottedMap({ map: mapData });
  } else {
    map = new DottedMap({
      height: props.mapHeight,
      width: props.mapWidth,
      countries: props.countries,
      region: props.region,
      grid: props.grid,
      avoidOuterPins: props.avoidOuterPins,
    });
  }

  // Add pins if provided
  if (props.pins && props.pins.length > 0) {
    props.pins.forEach((pin) => {
      map.addPin(pin);
    });
  }

  return map;
});

// Generate points for rendering
const data = computed(() => {
  const map = mapInstance.value;
  const points = map.getPoints();

  if (points.length === 0) return [];

  // DottedMap uses SVG coordinates (Y increases downwards)
  // We flip it for standard XY container if needed, but Unovis can handle it.
  // However, to keep it consistent with how maps are usually viewed:
  const maxY = Math.max(...points.map((p) => p.y));
  const minY = Math.min(...points.map((p) => p.y));

  return points.map((p) => ({
    ...p,
    // Flip Y axis to match geographical orientation in XY container
    y: maxY + minY - p.y,
  }));
});

// SVG content for raw rendering if needed
const svgContent = computed(() => {
  return mapInstance.value.getSVG({
    shape: props.shape,
    backgroundColor: props.backgroundColor,
    color: props.color,
    radius: props.dotSize,
  });
});
</script>

<template>
  <div
    class="dotted-world-map-container"
    :style="{
      backgroundColor: backgroundColor,
      height: typeof height === 'number' ? height + 'px' : height,
      width: '100%',
      position: 'relative',
    }"
  >
    <!-- Slot for custom rendering or overlay -->
    <slot :points="data" :map="mapInstance" :svg="svgContent">
      <div
        v-html="svgContent"
        class="raw-svg-container"
        style="width: 100%; height: 100%"
      ></div>
    </slot>
  </div>
</template>

<style scoped>
.dotted-world-map-container {
  overflow: hidden;
}

.raw-svg-container :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
