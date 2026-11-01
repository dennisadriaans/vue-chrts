<script setup lang="ts">
import { injectChartUi } from "../../composables/useChartUi";
import { computed, onBeforeUnmount, onMounted, shallowRef, useId, watch } from "vue";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import type { ZoomBehavior, ZoomTransform, D3ZoomEvent } from "d3-zoom";
import type { MapBaseProps, MapZoom } from "../../types/maps";
import type { MapMark } from "../../utils/maps";
import { categoriesToSeries } from "../../utils/categories";
import { themeToVars } from "../../utils/theme";
import ChartTooltip from "./ChartTooltip.vue";
import ChartLegend from "./ChartLegend.vue";
import ChartAccessibility from "./ChartAccessibility.vue";
import ChartEmptyState from "./ChartEmptyState.vue";
import ChartSkeleton from "./ChartSkeleton.vue";
import type { StyleValue } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<MapBaseProps & {
  marks: MapMark[];
  size: [number, number];
  geometryError?: string;
  sphere?: string;
  graticule?: string;
  tooltipTitle?: (datum: Record<string, unknown>) => string | number;
  tooltipValue?: (value: number) => string;
  heatmap?: boolean;
  heatmapBlur?: number;
  heatmapThreshold?: number;
}>();
const ui = injectChartUi();
const emit = defineEmits<{
  resize: [size: [number, number]];
  click: [mark: MapMark, event: MouseEvent | KeyboardEvent];
  mouseenter: [mark: MapMark, event: MouseEvent | FocusEvent];
  mouseleave: [mark: MapMark, event: MouseEvent | FocusEvent];
  zoom: [transform: MapZoom];
}>();
const viewport = shallowRef<HTMLDivElement>();
const svg = shallowRef<SVGSVGElement>();
const transform = shallowRef<ZoomTransform>(zoomIdentity);
const hovered = shallowRef<MapMark>();
const tooltipPosition = shallowRef({ x: 0, y: 0 });
const blurId = `vc-map-blur-${useId().replace(/:/g, "")}`;
const descriptionId = `vc-map-description-${useId().replace(/:/g, "")}`;
let behavior: ZoomBehavior<SVGSVGElement, unknown> | undefined;
let observer: ResizeObserver | undefined;
let animation = 0;
const limits = computed(() => props.zoomExtent ?? [1, 8]);
function initial() {
  const [width, height] = props.size;
  const k = Math.max(limits.value[0]!, Math.min(limits.value[1]!, props.zoomFactor ?? 1));
  return zoomIdentity.translate(width / 2, height / 2).scale(k).translate(-width / 2, -height / 2);
}
const stateError = computed(() => props.error ?? props.geometryError);
const legends = computed(() => categoriesToSeries(props.categories ?? {})
  .filter(item => !item.hidden)
  .map(item => ({ value: item.name, color: item.color, inactive: props.categories?.[item.dataKey]?.inactive })));
const legendAlign = computed(() => props.legendPosition?.includes("left") ? "flex-start" : props.legendPosition?.includes("right") ? "flex-end" : "center");
const rootStyle = computed(() => ({
  ...themeToVars(props.theme, props.colors),
  width: typeof props.width === "number" ? `${props.width}px` : props.width ?? "100%",
  flexDirection: props.legendPosition?.startsWith("top") ? "column-reverse" as const : "column" as const,
}));
const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`,
  transform: `translate(${tooltipPosition.value.x > props.size[0] / 2 ? "calc(-100% - 10px)" : "10px"}, ${tooltipPosition.value.y > props.size[1] / 2 ? "calc(-100% - 10px)" : "10px"})`,
}));
const label = computed(() => props.ariaLabel ?? "Geographic map");
const heatmap = computed(() => props.heatmap && transform.value.k < (props.heatmapThreshold ?? 4));
const points = computed(() => props.marks.filter(mark => mark.kind === "point"));
const visibleMarks = computed(() => heatmap.value ? props.marks.filter(mark => mark.kind !== "point") : props.marks);
const title = computed(() => {
  const mark = hovered.value;
  return mark ? props.tooltipTitle?.(mark.values) ?? mark.label ?? String(mark.values.name ?? mark.values.id ?? "Location") : "";
});
const tooltipItems = computed(() => {
  const mark = hovered.value;
  if (!mark) return [];
  const values = (mark.values.data as Record<string, unknown> | undefined) ?? mark.values;
  const numeric = Object.entries(values).filter(([key, value]) => typeof value === "number" && !["lat", "lng", "latitude", "longitude", "x", "y", "radius", "id"].includes(key));
  if (numeric.length) return numeric.map(([name, value]) => ({ name: String(props.categories?.[name]?.name ?? name), value: props.tooltipValue?.(value as number) ?? value, color: mark.color }));
  const latitude = values.latitude ?? values.lat;
  const longitude = values.longitude ?? values.lng;
  if (typeof latitude === "number" && typeof longitude === "number") return [{ name: "Coordinates", value: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, color: mark.color }];
  return [{ name: mark.kind === "link" ? "Route" : "Region", value: mark.label ?? String(values.id ?? title.value), color: mark.color }];
});
const accessibleRows = computed(() => props.marks.filter(mark => mark.kind !== "dot").map(mark => {
  const fields = (mark.values.data as Record<string, unknown> | undefined) ?? mark.values;
  const value = Object.entries(fields)
    .filter(([, value]) => typeof value === "number" || typeof value === "string")
    .map(([key, value]) => `${key}: ${value}`).join(", ");
  return {
    label: mark.label ?? String(mark.values.id ?? mark.key),
    values: [{ label: "Type", value: mark.kind }, { label: "Data", value }],
  };
}));

function apply(next: ZoomTransform) {
  if (svg.value && behavior) select(svg.value).call(behavior.transform, next);
}
function moveTo(next: ZoomTransform) {
  cancelAnimationFrame(animation);
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : props.zoomDuration ?? props.duration ?? 250;
  if (!duration) return apply(next);
  const start = performance.now();
  const from = transform.value;
  function tick(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    apply(zoomIdentity.translate(from.x + (next.x - from.x) * ease, from.y + (next.y - from.y) * ease).scale(from.k + (next.k - from.k) * ease));
    if (t < 1) animation = requestAnimationFrame(tick);
  }
  animation = requestAnimationFrame(tick);
}
function zoomTo(value: number) {
  const k = Math.max(limits.value[0]!, Math.min(limits.value[1]!, value));
  const center: [number, number] = [props.size[0] / 2, props.size[1] / 2];
  const local = transform.value.invert(center);
  moveTo(zoomIdentity.translate(center[0] - local[0] * k, center[1] - local[1] * k).scale(k));
}
function resetView() { if (svg.value) moveTo(initial()); }
function fitBounds(bounds: [[number, number], [number, number]]) {
  const [[x0, y0], [x1, y1]] = bounds;
  if (![x0, y0, x1, y1].every(Number.isFinite)) return;
  const [width, height] = props.size;
  const padding = props.fitViewPadding ?? 24;
  const k = Math.max(limits.value[0]!, Math.min(limits.value[1]!, (width - padding * 2) / Math.max(1, x1 - x0), (height - padding * 2) / Math.max(1, y1 - y0)));
  moveTo(zoomIdentity.translate(width / 2 - (x0 + x1) * k / 2, height / 2 - (y0 + y1) * k / 2).scale(k));
}
function configureZoom() {
  if (!svg.value) return;
  const element = select(svg.value);
  element.on(".zoom", null);
  behavior = zoom<SVGSVGElement, unknown>()
    .extent([[0, 0], props.size])
    .scaleExtent([limits.value[0]!, limits.value[1]!])
    .translateExtent([[0, 0], props.size])
    .clickDistance(4)
    .filter(event => !props.disableZoom && (!event.ctrlKey || event.type === "wheel") && !event.button && (event.type !== "wheel" || props.zoomOnScroll === true))
    .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
      if (event.sourceEvent) { cancelAnimationFrame(animation); hovered.value = undefined; }
      transform.value = event.transform;
      emit("zoom", { x: event.transform.x, y: event.transform.y, k: event.transform.k });
    });
  element.call(behavior);
  apply(transform.value);
}
function positionTooltip(event: MouseEvent | FocusEvent) {
  const rect = viewport.value?.getBoundingClientRect();
  if (!rect) return;
  let x: number;
  let y: number;
  if ("clientX" in event) {
    x = event.clientX;
    y = event.clientY;
  } else {
    const target = (event.target as SVGElement).getBoundingClientRect();
    x = target.x + target.width / 2;
    y = target.y + target.height / 2;
  }
  tooltipPosition.value = {
    x: Math.max(10, Math.min(rect.width - 10, x - rect.x)),
    y: Math.max(10, Math.min(rect.height - 10, y - rect.y)),
  };
}
function enter(mark: MapMark, event: MouseEvent | FocusEvent) {
  hovered.value = mark;
  positionTooltip(event);
  emit("mouseenter", mark, event);
}
function leave(mark: MapMark, event: MouseEvent | FocusEvent) {
  hovered.value = undefined;
  emit("mouseleave", mark, event);
}
function onKey(event: KeyboardEvent) {
  if (event.target !== svg.value || props.disableZoom) return;
  if (event.key === "+" || event.key === "=") zoomTo(transform.value.k * 1.5);
  else if (event.key === "-") zoomTo(transform.value.k / 1.5);
  else if (event.key === "0" || event.key === "Home") resetView();
  else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    const dx = event.key === "ArrowLeft" ? 40 : event.key === "ArrowRight" ? -40 : 0;
    const dy = event.key === "ArrowUp" ? 40 : event.key === "ArrowDown" ? -40 : 0;
    if (svg.value && behavior) select(svg.value).call(behavior.translateBy, dx / transform.value.k, dy / transform.value.k);
  } else return;
  event.preventDefault();
}
watch(svg, element => {
  if (element) { configureZoom(); apply(initial()); }
});
watch(() => [props.disableZoom, props.zoomOnScroll, props.zoomExtent], configureZoom, { deep: true });
watch(() => [props.zoomFactor, props.size], () => { configureZoom(); if (svg.value) apply(initial()); }, { deep: true });
watch(() => props.marks, () => { hovered.value = undefined; });
onMounted(() => {
  observer = new ResizeObserver(entries => {
    const rect = entries[0]?.contentRect;
    if (rect && rect.width > 0 && rect.height > 0) emit("resize", [rect.width, rect.height]);
  });
  if (viewport.value) observer.observe(viewport.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(animation);
  if (svg.value) select(svg.value).on(".zoom", null);
});
defineExpose({
  zoomIn: () => zoomTo(transform.value.k * 1.5),
  zoomOut: () => zoomTo(transform.value.k / 1.5),
  zoomTo, resetView, fitBounds,
});
</script>

<template>
  <div
    class="vue-chrts vc-map"
    v-bind="{ id: $attrs.id as string | undefined }"
    :class="[ui.rootClass, $attrs.class]"
    :style="[rootStyle, $attrs.style as StyleValue]"
  >
    <div ref="viewport" class="vc-map__viewport" :style="{ height: typeof height === 'string' ? height : `${height ?? 400}px`, background: backgroundColor }">
      <ChartSkeleton v-if="loading" :height="size[1]" shape="wave" :label="loadingLabel" />
      <ChartEmptyState v-else-if="stateError || !marks.length" :height="size[1]" :message="stateError ?? emptyLabel ?? 'No geographic data'" />
      <svg
        v-else ref="svg" :viewBox="`0 0 ${size[0]} ${size[1]}`"
        class="vc-map__svg" :class="{ 'vc-map__svg--zoomable': !disableZoom }"
        role="group" :aria-label="label"
        :aria-describedby="ariaDescription ? descriptionId : undefined" tabindex="0"
        @keydown="onKey" @mousemove="hovered && positionTooltip($event)"
        @mouseleave="hovered = undefined"
      >
        <desc v-if="ariaDescription" :id="descriptionId">{{ ariaDescription }}</desc>
        <defs><filter :id="blurId" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur :stdDeviation="heatmapBlur ?? 12" /></filter></defs>
        <g :transform="transform.toString()">
          <path v-if="sphere" :d="sphere" :fill="sphereColor ?? 'var(--vc-surface-bg)'" :stroke="graticuleColor ?? 'var(--vc-grid-color)'" vector-effect="non-scaling-stroke" />
          <path v-if="graticule" :d="graticule" fill="none" :stroke="graticuleColor ?? 'var(--vc-grid-color)'" stroke-width="0.5" vector-effect="non-scaling-stroke" />
          <g
            v-for="mark in visibleMarks" :key="mark.key"
            :class="['vc-map__mark', `vc-map__${mark.kind}`]"
            :style="{ cursor: mark.cursor ?? 'pointer' }"
            :tabindex="mark.kind === 'dot' ? undefined : 0" role="button"
            :aria-label="mark.label ?? String(mark.values.id ?? mark.key)"
            @mouseenter="enter(mark, $event)" @mouseleave="leave(mark, $event)"
            @focus="enter(mark, $event)" @blur="leave(mark, $event)"
            @click.stop="emit('click', mark, $event)"
            @keydown.enter.prevent.stop="emit('click', mark, $event)"
            @keydown.space.prevent.stop="emit('click', mark, $event)"
          >
            <slot :name="mark.kind" :values="mark.values" :x="mark.x" :y="mark.y" :path="mark.path" :color="mark.color" :radius="mark.radius" :scale="transform.k">
              <path v-if="mark.path" :d="mark.path" :fill="mark.kind === 'link' ? 'none' : mark.color" :stroke="mark.stroke" :stroke-width="mark.strokeWidth" :stroke-dasharray="mark.dasharray" vector-effect="non-scaling-stroke" />
              <polygon v-else-if="mark.polygon" :points="mark.polygon" :fill="mark.color" :stroke="mark.stroke" :stroke-width="mark.strokeWidth" :stroke-opacity="mark.strokeOpacity" />
              <circle v-else :cx="mark.x" :cy="mark.y" :r="mark.kind === 'point' || mark.kind === 'pin' ? (mark.radius ?? 5) / transform.k : mark.radius" :fill="mark.color" :stroke="mark.stroke" :stroke-width="mark.strokeWidth" :stroke-opacity="mark.strokeOpacity" vector-effect="non-scaling-stroke" />
              <text v-if="mark.showLabel && mark.label" :x="mark.x" :y="mark.y" :transform="`translate(${mark.x}, ${mark.y}) scale(${1 / transform.k}) translate(${-mark.x!}, ${-mark.y!})`" :dy="-(mark.radius ?? 5) - 6" text-anchor="middle" class="vc-map__label">{{ mark.label }}</text>
            </slot>
          </g>
          <g v-if="heatmap" :filter="`url(#${blurId})`" pointer-events="none"><circle v-for="point in points" :key="point.key" :cx="point.x" :cy="point.y" :r="Math.max(point.radius ?? 5, (heatmapBlur ?? 12) * 1.5) / transform.k" :fill="point.color" fill-opacity="0.75" /></g>
          <slot :width="size[0]" :height="size[1]" :transform="{ x: transform.x, y: transform.y, k: transform.k }" />
        </g>
      </svg>
      <div v-if="showControls && !disableZoom && !loading && !stateError && marks.length" class="vc-map__controls">
        <button type="button" aria-label="Zoom in" @click="zoomTo(transform.k * 1.5)">+</button>
        <button type="button" aria-label="Zoom out" @click="zoomTo(transform.k / 1.5)">−</button>
        <button type="button" aria-label="Reset map view" @click="resetView">↺</button>
      </div>
      <div v-if="hovered && !hideTooltip" class="vc-map__tooltip" :style="tooltipStyle" role="status">
        <slot name="tooltip" :values="hovered.values" :kind="hovered.kind"><ChartTooltip :active="true" :label="title" :payload="tooltipItems" :variant="tooltipVariant" :roundness="tooltipRoundness" /></slot>
      </div>
    </div>
    <div v-if="!hideLegend && (legends.length || $slots.legend)" class="vc-map__legend" :style="[legendStyle, { justifyContent: legendAlign }]"><slot name="legend" :items="legends"><ChartLegend :payload="legends" :variant="legendVariant" /></slot></div>
    <ChartAccessibility :label="label" :description="ariaDescription" :rows="accessibleRows" :show-table="accessibleDataTable" />
  </div>
</template>
