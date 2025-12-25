<script setup lang="ts" generic="T extends Record<string, any>, AreaDatum = any, PointDatum = any, LinkDatum = any">
import { ref, computed, useTemplateRef } from "vue";
import { VisSingleContainer, VisTopoJSONMap, VisTooltip } from "@unovis/vue";
import { MapsData } from "./types";
import { TopoJSONMap } from "@unovis/ts";

const props = withDefaults(
  defineProps<MapsData<T, AreaDatum, PointDatum, LinkDatum>>(),
  {
    zoomFactor: 1,
    duration: 600,
  }
);

const emit = defineEmits<{
  (e: "mouseenter", d: any): void;
  (e: "mouseleave", d: any): void;
  (e: "click", d: any, event: MouseEvent): void;
  (e: "pointclick", d: any): void;
}>();

const tooltipTriggers = computed(() => ({
  [TopoJSONMap.selectors.feature]: (d: T) => d?.properties?.name || d?.properties?.NAME_1 || '',
}));

// The VisTopoJSONMap exposes a component property with the TopoJSONMap instance
const map = useTemplateRef<{ component: TopoJSONMap<any, any, any> }>("map");

const clickedPoint = ref<any>(null);

// Handler for clicking on map features (countries, areas, etc.)
const handleFeatureClick = (d: any, event: MouseEvent) => {
  console.log("Clicked Feature", d);
  emit('click', d, event);

  if (map.value?.component) {
    const mapComponent = map.value.component as any;

    console.log(mapComponent, "mapComponent");
  }
};

// Handler for clicking on points
const handlePointClick = (d: any) => {
  console.log("Clicked Point", d);
  clickedPoint.value = d;
  emit('pointclick', d);

  // Zoom to the clicked point by using fitToPoints with just that point
  // Note: TopoJSONMap doesn't have zoomToPointById, but we can use internal methods
  if (map.value?.component) {
    // Access the internal _fitToPoints method
    (map.value.component as any)._fitToPoints([d], 0.1);
  }
};

const mapsData = computed(() => props.data)

</script>

<template>
  <VisSingleContainer
    :duration="props.duration"
    :data="mapsData"
  >
    <VisTopoJSONMap
      ref="map"
      :data="mapsData.areas"
      :point-data="mapsData.points"
      :link-data="mapsData.links"
      :topojson="props.topojson"
      :projection="props.projection"
      :zoom-factor="props.zoomFactor"
      :disable-zoom="props.disableZoom"
      :zoom-extent="props.zoomExtent"
      :zoom-duration="props.zoomDuration"
      :map-fit-to-points="props.mapFitToPoints"
      :map-feature-name="props.mapFeatureKey"
      :link-width="props.linkWidth"
      :link-color="props.linkColor"
      :link-cursor="props.linkCursor"
      :link-id="props.linkId"
      :link-source="props.linkSource"
      :link-target="props.linkTarget"
      :area-id="props.areaId"
      :area-color="props.areaColor"
      :area-cursor="props.areaCursor"
      :point-color="props.pointColor"
      :point-radius="props.pointRadius"
      :point-stroke-width="props.pointStrokeWidth"
      :point-cursor="props.pointCursor"
      :longitude="props.longitude"
      :latitude="props.latitude"
      :point-label="props.pointLabel"
      :point-label-position="props.pointLabelPosition"
      :point-label-text-brightness-ratio="props.pointLabelTextBrightnessRatio"
      :point-id="props.pointId"
      :heatmap-mode="props.heatmapMode"
      :heatmap-mode-blur-std-deviation="props.heatmapModeBlurStdDeviation"
      :heatmap-mode-zoom-level-threshold="props.heatmapModeZoomLevelThreshold"
      :events="{
          [TopoJSONMap.selectors.feature]: {
            click: handleFeatureClick,
            mouseenter: (d: any) => emit('mouseenter', d),
            mouseleave: (d: any) => emit('mouseleave', d),
          },
          [TopoJSONMap.selectors.point]: {
            click: handlePointClick,
          },
        }"
    />
    <VisTooltip :triggers="tooltipTriggers" />
  </VisSingleContainer>
</template>
