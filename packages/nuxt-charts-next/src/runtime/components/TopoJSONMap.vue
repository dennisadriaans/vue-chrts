<script setup lang="ts" generic="A extends MapArea = MapArea, P extends MapPoint = MapPoint, L extends MapLink<P> = MapLink<P>">
import { useChartUi } from "../composables/useChartUi";
import { computed, nextTick, shallowRef, watch } from "vue";
import { geoGraticule10, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import type { MapArea, MapPoint, MapLink, MapFeature, TopoJSONMapProps, MapZoom, MapMarkSlot, MapOverlaySlot, MapTooltipSlot } from "../types/maps";
import type { MapMark } from "../utils/maps";
import { createMapProjection, mapCountryId, mapFeatures, mapValue, projectMapPoint } from "../utils/maps";
import { sampleData } from "../utils/data";
import MapCanvas from "./internal/MapCanvas.vue";

const props = defineProps<TopoJSONMapProps<A, P, L>>();
useChartUi("topoJsonMap", props);
defineSlots<{
  tooltip?: (props: MapTooltipSlot<A, P, L>) => unknown;
  feature?: (props: MapMarkSlot<MapFeature<A>>) => unknown;
  point?: (props: MapMarkSlot<P>) => unknown;
  link?: (props: MapMarkSlot<L>) => unknown;
  legend?: (props: { items: Array<{ value: string; color?: string }> }) => unknown;
  default?: (props: MapOverlaySlot) => unknown;
}>();
const emit = defineEmits<{
  "feature-click": [values: MapFeature<A>, event: MouseEvent | KeyboardEvent];
  "point-click": [values: P, event: MouseEvent | KeyboardEvent];
  "link-click": [values: L, event: MouseEvent | KeyboardEvent];
  mouseenter: [values: MapFeature<A> | P | L, event: MouseEvent | FocusEvent];
  mouseleave: [values: MapFeature<A> | P | L, event: MouseEvent | FocusEvent];
  zoom: [transform: MapZoom];
}>();
const canvas = shallowRef<InstanceType<typeof MapCanvas>>();
const size = shallowRef<[number, number]>([960, typeof props.height === "number" ? props.height : 400]);
const geometry = computed(() => {
  try {
    return { collection: mapFeatures(props.geoJson ?? props.topoJson, props.mapFeatureKey), error: undefined };
  } catch (error) {
    return {
      collection: { type: "FeatureCollection", features: [] } as FeatureCollection,
      error: error instanceof Error ? error.message : "Invalid map geometry",
    };
  }
});
const view = computed(() => {
  const collection = geometry.value.collection;
  const projection = createMapProjection(
    props.projection, collection.features.length ? collection : { type: "Sphere" },
    size.value[0], size.value[1], props,
  );
  return { projection, path: geoPath(projection) };
});
const path = computed(() => view.value.path);
const areas = computed(() => {
  const rows = new Map((props.data?.areas ?? []).map(area => [String(area.id), area]));
  return geometry.value.collection.features.map((feature, index) => {
    const properties = feature.properties ?? {};
    const id = typeof props.featureId === "function" ? props.featureId(feature) : props.featureId ? properties[props.featureId] : mapCountryId(feature, index);
    const aliases = props.featureId !== undefined ? [id] : [
      id, properties.iso_a2, properties.iso_a3, properties.iso_n3,
      properties.iso_n3 == null ? undefined : Number(properties.iso_n3),
      properties.ISO_A2, properties.ISO_A3, properties.name,
    ];
    const row = aliases.map(key => rows.get(String(key))).find(Boolean);
    return { ...properties, ...row, id: row?.id ?? id, properties, feature } as MapFeature<A>;
  });
});
function areaValue(area: MapFeature<A>) {
  const value = typeof props.value === "function" ? props.value(area) : props.value ? area[props.value] : area.value;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
const domain = computed(() => {
  if (props.valueDomain) return props.valueDomain;
  const values = areas.value.map(areaValue).filter((value): value is number => value !== undefined);
  return values.length ? [Math.min(...values), Math.max(...values)] : [0, 1];
});
function areaColor(area: MapFeature<A>, index: number) {
  if (props.areaColor !== undefined) return mapValue(props.areaColor, area, index, "var(--vc-map-feature-color)");
  if (area.color) return area.color;
  const value = areaValue(area);
  if (value === undefined) return "var(--vc-map-feature-color)";
  if (props.colorScale) return props.colorScale(value);
  const t = domain.value[0] === domain.value[1] ? 1 : Math.max(0, Math.min(1, (value - domain.value[0]!) / (domain.value[1]! - domain.value[0]!)));
  const [low, high] = props.colorRange ?? ["var(--vc-map-feature-color)", "var(--vc-series-0)"];
  return `color-mix(in srgb, ${high} ${Math.round(t * 100)}%, ${low})`;
}
const projectedPoints = computed(() => sampleData(props.data?.points ?? [], props.maxDataPoints ?? 2000).flatMap((point, index) => {
  const coordinates = projectMapPoint(view.value.projection, [point.longitude, point.latitude], path.value);
  return coordinates ? [{ point, index, coordinates }] : [];
}));
const marks = computed<MapMark[]>(() => {
  const features = areas.value.flatMap((area, index) => {
    const d = path.value(area.feature);
    return d ? [{
      key: `feature-${index}`, kind: "feature" as const, values: area, path: d,
      color: areaColor(area, index),
      stroke: mapValue(props.areaStroke, area, index, "var(--vc-map-boundary-color)"),
      strokeWidth: mapValue(props.areaStrokeWidth, area, index, 0.6),
      cursor: mapValue(props.areaCursor, area, index, "pointer"),
      label: String(area.name ?? area.properties.name ?? area.id),
    }] : [];
  });
  const pointsById = new Map((props.data?.points ?? []).map(point => [String(point.id), point]));
  const links = sampleData(props.data?.links ?? [], props.maxDataPoints ?? 2000).flatMap((link, index) => {
    const source = typeof link.source === "object" ? link.source : pointsById.get(String(link.source));
    const target = typeof link.target === "object" ? link.target : pointsById.get(String(link.target));
    if (!source || !target) return [];
    const start: [number, number] = [source.longitude, source.latitude];
    const end: [number, number] = [target.longitude, target.latitude];
    if (![...start, ...end].every(Number.isFinite) || Math.abs(start[1]) > 90 || Math.abs(end[1]) > 90) return [];
    let d: string | null = null;
    if (!props.linkCurve || props.linkCurve === "geodesic") d = path.value({ type: "LineString", coordinates: [start, end] });
    else {
      const a = projectMapPoint(view.value.projection, start);
      const b = projectMapPoint(view.value.projection, end);
      if (!a || !b) return [];
      const curve = props.linkCurvature ?? 0.2;
      d = props.linkCurve === "straight" ? `M${a}L${b}` : `M${a}Q${(a[0] + b[0]) / 2 - (b[1] - a[1]) * curve},${(a[1] + b[1]) / 2 + (b[0] - a[0]) * curve} ${b}`;
    }
    if (!d) return [];
    const color = mapValue(props.linkColor, link, index, link.color ?? target.color ?? "var(--vc-series-0)");
    return [{
      key: `link-${index}`, kind: "link" as const, values: link, path: d, color,
      stroke: color,
      strokeWidth: mapValue(props.linkWidth, link, index, link.width ?? 1.5),
      dasharray: mapValue(props.linkDasharray, link, index, ""),
      cursor: mapValue(props.linkCursor, link, index, "pointer"),
      label: link.label ?? `${source.label ?? source.id} → ${target.label ?? target.id}`,
    }];
  });
  const points = projectedPoints.value.map(({ point, index, coordinates }) => ({
    key: `point-${point.id}`, kind: "point" as const, values: point,
    x: coordinates[0], y: coordinates[1],
    radius: mapValue(props.pointRadius ?? props.pointSize, point, index, point.radius ?? 5),
    color: mapValue(props.pointColor, point, index, point.color ?? "var(--vc-series-0)"),
    stroke: mapValue(props.pointStrokeColor, point, index, "var(--vc-surface-bg)"),
    strokeWidth: mapValue(props.pointStrokeWidth, point, index, 1.5),
    cursor: mapValue(props.pointCursor, point, index, "pointer"),
    label: mapValue(props.pointLabel, point, index, point.label ?? String(point.id)),
    showLabel: props.showPointLabels,
  }));
  return [...features, ...links, ...points];
});
function fitToPoints(points = props.data?.points ?? []) {
  const positions = points.flatMap(point => {
    const projected = projectMapPoint(view.value.projection, [point.longitude, point.latitude], path.value);
    return projected ? [projected] : [];
  });
  if (!positions.length) return;
  canvas.value?.fitBounds([[Math.min(...positions.map(p => p[0])), Math.min(...positions.map(p => p[1]))], [Math.max(...positions.map(p => p[0])), Math.max(...positions.map(p => p[1]))]]);
}
function zoomToFeature(id: string | number) {
  const area = areas.value.find(area => String(area.id) === String(id) || String(area.feature.id) === String(id));
  if (area) canvas.value?.fitBounds(path.value.bounds(area.feature));
}
function click(mark: MapMark, event: MouseEvent | KeyboardEvent) {
  if (mark.kind === "feature") {
    emit("feature-click", mark.values as MapFeature<A>, event);
    if (props.zoomOnClick) zoomToFeature(mark.values.id as string | number);
  }
  if (mark.kind === "point") {
    emit("point-click", mark.values as P, event);
    if (props.zoomOnClick) fitToPoints([mark.values as P]);
  }
  if (mark.kind === "link") emit("link-click", mark.values as L, event);
}
watch([() => props.mapFitToPoints, projectedPoints, size], async () => {
  await nextTick();
  if (props.mapFitToPoints) fitToPoints();
}, { immediate: true });
defineExpose({
  zoomIn: () => canvas.value?.zoomIn(),
  zoomOut: () => canvas.value?.zoomOut(),
  zoomTo: (k: number) => canvas.value?.zoomTo(k),
  resetView: () => canvas.value?.resetView(),
  fitToPoints,
  zoomToFeature,
});
</script>

<template>
  <MapCanvas
    ref="canvas"
    v-bind="props"
    :marks="marks"
    :size="size"
    :geometry-error="geometry.error"
    :sphere="showSphere ? path({ type: 'Sphere' }) ?? undefined : undefined"
    :graticule="showGraticule ? path(geoGraticule10()) ?? undefined : undefined"
    :tooltip-title="tooltipTitleFormatter ? datum => tooltipTitleFormatter!(datum as MapFeature<A> | P | L) : undefined"
    :tooltip-value="yFormatter ? value => (yFormatter as (value: number) => string)(value) : undefined"
    :heatmap="heatmapMode"
    :heatmap-blur="heatmapModeBlurStdDeviation"
    :heatmap-threshold="heatmapModeZoomLevelThreshold"
    @resize="size = $event"
    @click="click"
    @mouseenter="(mark, event) => emit('mouseenter', mark.values as MapFeature<A> | P | L, event)"
    @mouseleave="(mark, event) => emit('mouseleave', mark.values as MapFeature<A> | P | L, event)"
    @zoom="emit('zoom', $event)"
  >
    <template v-if="$slots.tooltip" #tooltip="scope"><slot name="tooltip" v-bind="scope as MapTooltipSlot<A, P, L>" /></template>
    <template v-if="$slots.feature" #feature="scope"><slot name="feature" v-bind="scope" :values="scope.values as MapFeature<A>" :projection="view.projection" /></template>
    <template v-if="$slots.point" #point="scope"><slot name="point" v-bind="scope" :values="scope.values as P" :projection="view.projection" /></template>
    <template v-if="$slots.link" #link="scope"><slot name="link" v-bind="scope" :values="scope.values as L" :projection="view.projection" /></template>
    <template v-if="$slots.legend" #legend="scope"><slot name="legend" v-bind="scope" /></template>
    <template v-if="$slots.default" #default="scope"><slot v-bind="scope" :projection="view.projection" /></template>
  </MapCanvas>
</template>
