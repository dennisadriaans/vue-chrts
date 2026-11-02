<script setup lang="ts">
import { useChartUi } from "../composables/useChartUi";
import { computed, shallowRef } from "vue";
import { geoGraticule10, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import type { DottedMapProps, MapDot, MapPin, MapZoom, PrecomputedMap, MapMarkSlot, MapOverlaySlot, DottedMapTooltipSlot } from "../types/maps";
import type { MapMark } from "../utils/maps";
import { containsMapPoint, createMapProjection, DEFAULT_MAP_REGION, inRegion, MAP_REGIONS, mapFeatures, mapValue, projectMapPoint, regionGeometry } from "../utils/maps";
import { filterMapCountries, generateMapDots, getPin } from "../utils/dottedMap";
import { sampleData } from "../utils/data";
import MapCanvas from "./internal/MapCanvas.vue";

// Vue casts an omitted boolean prop to false, which would skip fitting the projection.
const props = withDefaults(defineProps<DottedMapProps>(), { fitView: true });
useChartUi("dottedMap", props);
defineSlots<{
  tooltip?: (props: DottedMapTooltipSlot) => unknown;
  pin?: (props: MapMarkSlot<MapPin> & { points: MapDot[] }) => unknown;
  dot?: (props: MapMarkSlot<MapDot> & { points: MapDot[] }) => unknown;
  legend?: (props: { items: Array<{ value: string; color?: string }> }) => unknown;
  default?: (props: MapOverlaySlot & { points: MapDot[] }) => unknown;
}>();
const emit = defineEmits<{
  "pin-click": [pin: MapPin, event: MouseEvent | KeyboardEvent];
  "point-click": [event: MouseEvent | KeyboardEvent, point: MapDot];
  mouseenter: [values: MapPin | MapDot, event: MouseEvent | FocusEvent];
  mouseleave: [values: MapPin | MapDot, event: MouseEvent | FocusEvent];
  zoom: [transform: MapZoom];
}>();
const canvas = shallowRef<InstanceType<typeof MapCanvas>>();
const size = shallowRef<[number, number]>([960, typeof props.height === "number" ? props.height : 400]);
const precomputed = computed(() => {
  try {
    if (!props.precomputedMap) return { map: undefined, error: undefined };
    const map = (typeof props.precomputedMap === "string"
      ? JSON.parse(props.precomputedMap)
      : props.precomputedMap) as PrecomputedMap;
    if (!(map.width > 0 && map.height > 0 && map.points)) {
      throw new Error("Precomputed map must contain width, height, and points.");
    }
    return { map, error: undefined };
  } catch (error) {
    return { map: undefined, error: error instanceof Error ? error.message : "Invalid precomputed map" };
  }
});
const countries = computed(() => props.countries ?? precomputed.value.map?.countries
  ?? (props.regionName === "usa" ? ["USA"] : undefined));
const region = computed(() => {
  if (props.region) return props.region;
  if (precomputed.value.map?.region) return precomputed.value.map.region;
  if (props.regionName && props.regionName !== "world") return MAP_REGIONS[props.regionName];
  return !countries.value?.length && !props.geoJson ? DEFAULT_MAP_REGION : undefined;
});
const geometry = computed(() => {
  try {
    return {
      collection: filterMapCountries(mapFeatures(props.geoJson, props.mapFeatureKey), countries.value),
      error: undefined,
    };
  } catch (error) {
    return {
      collection: { type: "FeatureCollection", features: [] } as FeatureCollection,
      error: error instanceof Error ? error.message : "Invalid map geometry",
    };
  }
});
const precomputedLayout = computed(() => {
  const map = precomputed.value.map;
  const scale = map ? Math.min(size.value[0] / map.width, size.value[1] / map.height) : 1;
  return {
    scale,
    x: map ? (size.value[0] - map.width * scale) / 2 : 0,
    y: map ? (size.value[1] - map.height * scale) / 2 : 0,
  };
});
const view = computed(() => {
  const map = precomputed.value.map;
  const land = geometry.value.collection;
  const fitGeometry = region.value ? regionGeometry(region.value)
    : land.features.length ? land : { type: "Sphere" as const };
  const projection = createMapProjection(
    props.projection ?? map?.projection ?? "mercator",
    fitGeometry, size.value[0], size.value[1], props, region.value,
  );
  const layout = precomputedLayout.value;
  if (map?.scale !== undefined && map.translate) {
    projection.scale(map.scale * layout.scale).translate([
      map.translate[0] * layout.scale + layout.x,
      map.translate[1] * layout.scale + layout.y,
    ]);
  } else if (map?.X_MIN !== undefined && map.Y_MAX !== undefined && map.X_RANGE) {
    const scale = map.width * 6378137 / map.X_RANGE;
    projection.scale(scale * layout.scale).translate([
      -map.X_MIN * map.width / map.X_RANGE * layout.scale + layout.x,
      map.Y_MAX / 6378137 * scale * layout.scale + layout.y,
    ]);
  }
  // A fresh view also invalidates marks when a passed D3 instance is resized in place.
  return { projection, path: geoPath(projection) };
});
const grid = computed(() => {
  try {
    const map = precomputed.value.map;
    if (map) {
      const layout = precomputedLayout.value;
      const dots = Object.values(map.points).map(dot => ({
        ...dot,
        x: dot.x * layout.scale + layout.x,
        y: dot.y * layout.scale + layout.y,
      }));
      return { dots, spacing: layout.scale, error: undefined };
    }
    const spacing = props.mapWidth ? size.value[0] / Math.max(1, props.mapWidth) : size.value[1] / Math.max(1, props.mapHeight ?? 60);
    const dots = generateMapDots(
      geometry.value.collection, view.value.projection, size.value[0], size.value[1],
      { ...props, region: region.value },
    );
    return { dots, spacing, error: undefined };
  } catch (error) {
    return { dots: [] as MapDot[], spacing: 1, error: error instanceof Error ? error.message : "Invalid dotted map data" };
  }
});
function hexagon(x: number, y: number, radius: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI / 3 * index;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(" ");
}
const marks = computed<MapMark[]>(() => {
  const spacing = grid.value.spacing;
  const dots = grid.value.dots.map((dot, index) => {
    const radius = (dot.svgOptions?.radius ?? props.dotSize ?? 0.3) * spacing;
    return {
      key: `dot-${index}`, kind: "dot" as const, values: dot,
      x: dot.x, y: dot.y, radius,
      polygon: props.shape === "hexagon" ? hexagon(dot.x, dot.y, radius) : undefined,
      color: dot.svgOptions?.color ?? props.countryColors?.[dot.countryId ?? ""] ?? props.color ?? "var(--vc-map-dot-color)",
      stroke: dot.svgOptions?.strokeColor ?? props.strokeColor,
      strokeWidth: (dot.svgOptions?.strokeWidth ?? props.strokeWidth ?? 0) * spacing,
      strokeOpacity: dot.svgOptions?.strokeOpacity ?? props.strokeOpacity ?? 1,
      label: dot.label ?? dot.countryId,
    };
  });
  const pins = sampleData(props.pins ?? [], props.maxDataPoints ?? 2000).flatMap((pin, index) => {
    const coordinates: [number, number] = [pin.lng, pin.lat];
    if (!inRegion(coordinates, region.value)) return [];
    if (props.avoidOuterPins && !containsMapPoint(geometry.value.collection, coordinates)) return [];
    let p = projectMapPoint(view.value.projection, coordinates);
    if (!p) return [];
    if (precomputed.value.map) {
      const dot = getPin(precomputed.value.map, pin);
      const layout = precomputedLayout.value;
      p = [dot.x * layout.scale + layout.x, dot.y * layout.scale + layout.y];
    }
    const label = pin.label ?? String(pin.data?.name ?? pin.data?.city ?? pin.id ?? "Location");
    return [{
      key: `pin-${pin.id ?? index}`, kind: "pin" as const, values: pin,
      x: p[0], y: p[1],
      radius: mapValue(props.pinSize, pin, index, pin.radius ?? (pin.svgOptions?.radius === undefined ? 5 : pin.svgOptions.radius * spacing)),
      color: mapValue(props.pinColor, pin, index, pin.color ?? pin.svgOptions?.color ?? "var(--vc-series-0)"),
      stroke: pin.svgOptions?.strokeColor ?? "var(--vc-surface-bg)",
      strokeWidth: pin.svgOptions?.strokeWidth ?? 1,
      strokeOpacity: pin.svgOptions?.strokeOpacity ?? 1,
      label, showLabel: props.showPinLabels,
    }];
  });
  return [...dots, ...pins];
});
const categories = computed(() => props.categories ?? (props.legend ? Object.fromEntries(props.legend.map((item, index) => [String(index), { name: item.label, color: item.color }])) : undefined));
function click(mark: MapMark, event: MouseEvent | KeyboardEvent) {
  if (mark.kind === "pin") emit("pin-click", mark.values as MapPin, event);
  else emit("point-click", event, mark.values as MapDot);
}
defineExpose({
  zoomIn: () => canvas.value?.zoomIn(),
  zoomOut: () => canvas.value?.zoomOut(),
  zoomTo: (k: number) => canvas.value?.zoomTo(k),
  resetView: () => canvas.value?.resetView(),
});
</script>

<template>
  <MapCanvas
    ref="canvas"
    v-bind="props"
    :style="{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }"
    :marks="marks"
    :size="size"
    :geometry-error="geometry.error ?? precomputed.error ?? grid.error"
    :categories="categories"
    :hide-legend="hideLegend || showLegend === false"
    :zoom-factor="zoomFactor ?? defaultZoom"
    :sphere="showSphere ? view.path({ type: 'Sphere' }) ?? undefined : undefined"
    :graticule="showGraticule ? view.path(geoGraticule10()) ?? undefined : undefined"
    :tooltip-title="tooltipTitleFormatter ? datum => tooltipTitleFormatter!(datum as MapPin | MapDot) : undefined"
    @resize="size = $event"
    @click="click"
    @mouseenter="(mark, event) => emit('mouseenter', mark.values as MapPin | MapDot, event)"
    @mouseleave="(mark, event) => emit('mouseleave', mark.values as MapPin | MapDot, event)"
    @zoom="emit('zoom', $event)"
  >
    <template v-if="$slots.tooltip" #tooltip="scope"><slot name="tooltip" v-bind="scope as DottedMapTooltipSlot" /></template>
    <template v-if="$slots.pin" #pin="scope"><slot name="pin" v-bind="scope" :values="scope.values as MapPin" :projection="view.projection" :points="grid.dots" /></template>
    <template v-if="$slots.dot" #dot="scope"><slot name="dot" v-bind="scope" :values="scope.values as MapDot" :projection="view.projection" :points="grid.dots" /></template>
    <template v-if="$slots.legend" #legend="scope"><slot name="legend" v-bind="scope" /></template>
    <template v-if="$slots.default" #default="scope"><slot v-bind="scope" :projection="view.projection" :points="grid.dots" /></template>
  </MapCanvas>
</template>
