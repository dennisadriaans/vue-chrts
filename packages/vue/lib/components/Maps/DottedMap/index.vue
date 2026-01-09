<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type {
  MapPin,
  MapRegionName,
  MapVariant,
  MapLegendItem,
  DottedMapProps,
} from "./types";
import { REGIONS, COUNTRIES, DEFAULT_ZOOM } from "./regions";
import { WORLD_PINS, USA_PINS } from "./pins";
import { useMapPanZoom } from "./useMapPanZoom";
import DottedMapCore from "./core.vue";
import MapZoomControls from "./MapZoomControls.vue";
import MapLegend from "./MapLegend.vue";

interface Props extends DottedMapProps {
  /** The region name for quick setup */
  regionName?: MapRegionName;
  /** Default zoom level */
  defaultZoom?: number;
  /** Show zoom controls */
  showControls?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Maximum height of the map container */
  maxHeight?: string | number;
  /** Custom legend items */
  legend?: MapLegendItem[];
}

const props = withDefaults(defineProps<Props>(), {
  regionName: "world",
  showControls: true,
  showLegend: true,
  height: "600px",
});

const emit = defineEmits<{
  "pin-click": [pin: MapPin];
  "point-click": [event: MouseEvent, point: MapPin];
  "pin-add": [pin: MapPin];
  "pin-remove": [pin: MapPin, index: number];
}>();

// Use the pan/zoom composable
const {
  offset,
  scale,
  zoomIn,
  zoomOut,
  resetView,
  wasClick,
  onWheel,
  onMouseDown,
} = useMapPanZoom();

// Internal reactive pins (allows for add/remove if no external pins provided)
const internalPins = ref<MapPin[]>([]);

// Computed pins based on props or internal state
const activePins = computed(() => {
  if (props.pins) return props.pins;
  return internalPins.value;
});

// Build the variant configuration based on regionName
const variant = computed<MapVariant>(() => {
  const regionConfig = REGIONS[props.regionName || "world"];
  const countries = COUNTRIES[props.regionName || "world"];
  const defaultZoom = DEFAULT_ZOOM[props.regionName || "world"] ?? 1;

  // Get default pins for region
  const defaultPins = props.regionName === "usa" ? USA_PINS : WORLD_PINS;

  const base: MapVariant = {
    region: props.region ?? regionConfig,
    countries: props.countries ?? countries,
    pins: props.pins ?? defaultPins,
    defaultZoom: props.defaultZoom ?? defaultZoom,
    color: props.color,
    dotSize: props.dotSize,
    grid: props.grid,
    mapHeight: props.mapHeight,
    mapWidth: props.mapWidth,
    shape: props.shape,
    strokeWidth: props.strokeWidth,
    strokeOpacity: props.strokeOpacity,
  };

  // If explicit props are provided, we don't apply region-specific defaults
  if (props.region || props.countries || props.mapHeight || props.mapWidth) {
    return base;
  }

  // Region-specific overrides
  switch (props.regionName) {
    case "europe":
      return { ...base, dotSize: props.dotSize ?? 0.3 };
    case "usa":
      return { ...base, mapWidth: 130, dotSize: props.dotSize ?? 0.3 };
    case "asia":
      return { ...base, grid: props.grid ?? "vertical" };
    case "oceania":
      return { ...base, dotSize: props.dotSize ?? 0.3 };
    default:
      return { ...base, grid: props.grid ?? "vertical" };
  }
});

const activeLegend = computed(() => props.legend );

// Handle pin click with movement detection
const handlePinClick = (pin: MapPin) => {
  if (wasClick()) {
    emit("pin-click", pin);
  }
};

// Handle point click (clicking on map dots)
const handlePointClick = (event: MouseEvent, point: MapPin) => {
  if (!wasClick()) return;

  emit("point-click", event, point);

  // If no external pins provided, handle internally
  if (!props.pins) {
    const index = internalPins.value.findIndex(
      (p) =>
        Math.abs(p.lat - point.lat) < 0.0001 &&
        Math.abs(p.lng - point.lng) < 0.0001
    );

    if (index > -1) {
      const removed = internalPins.value.splice(index, 1)[0];
      emit("pin-remove", removed, index);
    } else {
      const newPin: MapPin = {
        lat: point.lat,
        lng: point.lng,
        svgOptions: { color: "var(--ui-text)", radius: 0.15 },
        data: { city: "Custom Pin", region: "Other" },
      };
      internalPins.value.push(newPin);
      emit("pin-add", newPin);
    }
  }
};

// Reset view when regionName or defaultZoom changes
watch(
  [() => props.regionName, () => props.defaultZoom],
  () => {
    resetView(variant.value.defaultZoom);
  },
  { immediate: true }
);

// Expose methods for parent component
defineExpose({
  zoomIn,
  zoomOut,
  resetView: () => resetView(variant.value.defaultZoom),
});
</script>

<template>
  <div
    class="w-full h-full overflow-hidden relative"
    :style="{
      width: '100%',
      height: props.maxHeight,
    }"
  >
    <!-- Map container with pan/zoom -->
    <div
      class="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
      :style="{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
      }"
      @mousedown="onMouseDown"
      @wheel.prevent="onWheel"
    >
      <DottedMapCore
        v-bind="$attrs"
        width="100%"
        height="100%"
        :map-height="variant.mapHeight || 60"
        :color="variant.color || 'var(--ui-text-dimmed)'"
        :dot-size="variant.dotSize || 0.36"
        :grid="variant.grid"
        :shape="variant.shape"
        :countries="variant.countries"
        :region="variant.region"
        :pins="activePins"
        :stroke-width="variant.strokeWidth"
        :stroke-opacity="variant.strokeOpacity"
        :avoid-outer-pins="props.avoidOuterPins"
        :precomputed-map="props.precomputedMap"
        :background-color="props.backgroundColor"
        :use-raw-svg="props.useRawSvg"
        class="w-full h-full object-contain"
        @pin-click="handlePinClick"
        @point-click="handlePointClick"
      />
    </div>

    <!-- Zoom controls slot -->
    <div v-if="showControls" class="absolute top-0 right-0">
      <slot name="controls">
        <MapZoomControls
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
          @reset="resetView(variant.defaultZoom)"
        />
      </slot>
    </div>
    <!-- Legend slot -->
    <div
      v-if="showLegend && activeLegend && activeLegend.length > 0"
      class="absolute bottom-4 right-4 flex flex-col gap-2"
    >
      <slot name="legend" :items="activeLegend">
        <MapLegend :items="activeLegend" />
      </slot>
    </div>

    <!-- Default slot for overlays -->
    <slot />
  </div>
</template>
