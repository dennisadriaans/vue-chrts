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
    :duration="duration"
    :data="mapsData"
  >
    <VisTopoJSONMap
      ref="map"
      :data="mapsData.areas"
      :point-data="mapsData.points"
      :link-data="mapsData.links"
      :topojson="topojson"
      :projection="projection"
      :zoom-factor="zoomFactor"
      :disable-zoom="disableZoom"
      :zoom-extent="zoomExtent"
      :zoom-duration="zoomDuration"
      :map-fit-to-points="mapFitToPoints"
      :map-feature-name="mapFeatureKey"
      :link-width="linkWidth"
      :link-color="linkColor"
      :link-cursor="linkCursor"
      :link-id="linkId"
      :link-source="linkSource"
      :link-target="linkTarget"
      :area-id="areaId"
      :area-color="areaColor"
      :area-cursor="areaCursor"
      :point-color="pointColor"
      :point-radius="pointRadius"
      :point-stroke-width="pointStrokeWidth"
      :point-cursor="pointCursor"
      :longitude="longitude"
      :latitude="latitude"
      :point-label="pointLabel"
      :point-label-position="pointLabelPosition"
      :point-label-text-brightness-ratio="pointLabelTextBrightnessRatio"
      :point-id="pointId"
      :heatmap-mode="heatmapMode"
      :heatmap-mode-blur-std-deviation="heatmapModeBlurStdDeviation"
      :heatmap-mode-zoom-level-threshold="heatmapModeZoomLevelThreshold"
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
