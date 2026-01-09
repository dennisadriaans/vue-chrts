<script setup lang="ts">
import { computed } from "vue";
import type { DottedMapProps } from "./types";
import { getMap, getPin } from "./mapUtils";
import geojsonWorld from "../../../data/countries.geo.json";

const props = withDefaults(defineProps<DottedMapProps>(), {
  grid: "vertical",
  avoidOuterPins: false,
  color: "#ffffff",
  dotSize: 0.5,
  strokeWidth: 0,
  strokeOpacity: 1,
  shape: "circle",
  height: "600px",
});

const emit = defineEmits<{
  (e: "pin-click", point: any): void;
  (e: "point-click", event: MouseEvent, point: any): void;
}>();

// Create the map instance
const mapInstance = computed(() => {
  let map;
  if (props.precomputedMap) {
    map =
      typeof props.precomputedMap === "string"
        ? JSON.parse(props.precomputedMap)
        : props.precomputedMap;
  } else {
    map = getMap({
      height: props.mapHeight,
      width: props.mapWidth,
      countries: props.countries,
      region: props.region,
      grid: props.grid,
      geojsonWorld,
    });
  }

  // Add pins if provided
  if (props.pins && props.pins.length > 0) {
    props.pins.forEach((pin) => {
      if (
        typeof pin.lat === "number" &&
        isFinite(pin.lat) &&
        typeof pin.lng === "number" &&
        isFinite(pin.lng)
      ) {
        const pinPoint = getPin(map, { lat: pin.lat, lng: pin.lng });
        const key = [pinPoint.x, pinPoint.y].join(";");
        map.points[key] = {
          ...pinPoint,
          data: pin.data,
          svgOptions: {
            radius: props.dotSize,
            strokeColor: props.strokeColor,
            strokeWidth: props.strokeWidth,
            strokeOpacity: props.strokeOpacity,
            ...pin.svgOptions,
          },
        };
      }
    });
  }

  return map;
});

// Generate points for rendering
const data = computed(() => {
  const map = mapInstance.value;
  const points = Object.values(map.points);

  if (points.length === 0) return [];

  // DottedMap uses SVG coordinates (Y increases downwards)
  // We flip it for standard XY container if needed, but Unovis can handle it.
  const maxY = Math.max(...points.map((p: any) => p.y));
  const minY = Math.min(...points.map((p: any) => p.y));

  return points.map((p: any) => {
    return {
      ...p,
      // Flip Y axis to match geographical orientation in XY container
      y: maxY + minY - p.y,
    };
  });
});

// SVG content for raw rendering if needed
const svgContent = computed(() => {
  const map = mapInstance.value;
  const { width, height, points } = map;
  const { shape, backgroundColor, color, dotSize, strokeColor, strokeWidth, strokeOpacity } = props;

  const getPointSvg = (p: any) => {
    const radius = p.svgOptions?.radius || dotSize;
    const fillColor = p.svgOptions?.color || color;
    const sColor = p.svgOptions?.strokeColor || strokeColor || fillColor;
    const sWidth = p.svgOptions?.strokeWidth ?? strokeWidth;
    const sOpacity = p.svgOptions?.strokeOpacity ?? strokeOpacity;

    const strokeAttrs = sWidth > 0 ? `stroke="${sColor}" stroke-width="${sWidth}" stroke-opacity="${sOpacity}"` : '';

    if (shape === "circle") {
      return `<circle cx="${p.x}" cy="${p.y}" r="${radius}" fill="${fillColor}" ${strokeAttrs} />`;
    } else if (shape === "hexagon") {
      const sqrt3radius = Math.sqrt(3) * radius;
      const polyPoints = [
        [p.x + sqrt3radius, p.y - radius],
        [p.x + sqrt3radius, p.y + radius],
        [p.x, p.y + 2 * radius],
        [p.x - sqrt3radius, p.y + radius],
        [p.x - sqrt3radius, p.y - radius],
        [p.x, p.y - 2 * radius],
      ];
      return `<polyline points="${polyPoints
        .map((point) => point.join(","))
        .join(" ")}" fill="${fillColor}" ${strokeAttrs} />`;
    }
    return "";
  };

  const pointsSvg = Object.values(points).map(getPointSvg).join("\n");

  const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${backgroundColor}">
    ${pointsSvg}
  </svg>`;

  // Inject data-index into each dot for event delegation
  let pointIndex = 0;
  return svg.replace(/<(circle|polyline)/g, (_: string, type: string) => {
    return `<${type} data-index="${pointIndex++}" style="cursor: pointer;"`;
  });
});


function handleSvgClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const index = target.getAttribute("data-index");
  if (index !== null) {
    const point = data.value[Number(index)];
    emit("point-click", event, point);
  }
}
</script>

<template>
  <div
    class="dotted-world-map-container"
    :style="{
      backgroundColor: backgroundColor,
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
        @click="handleSvgClick"
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
