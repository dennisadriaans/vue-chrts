<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, useTemplateRef } from "vue";
import { VisSingleContainer, VisTopoJSONMap, VisTooltip } from "@unovis/vue";
import { MapsData } from "./types";
import { TopoJSONMap } from "@unovis/ts";


const props = defineProps<MapsData<T>>();

const tooltipTriggers = {
  [TopoJSONMap.selectors.feature]: (d: T) => `${d.properties.name}`,
};

// The VisTopoJSONMap exposes a component property with the TopoJSONMap instance
const map = useTemplateRef<{ component: TopoJSONMap<any, any, any> }>("map");

const pointRadius = (d: any) => 25;

const hoveredArea = ref<string | null>(null);
const clickedPoint = ref<any>(null);

// When a point is clicked, we'll set it to zoom/fit to that point
const areas = computed(() =>
  hoveredArea.value === "US" ? [{ id: "US", color: "red" }] : []
);

// Handler for clicking on map features (countries, areas, etc.)
const handleFeatureClick = (d: any, event: MouseEvent) => {
  console.log('Clicked Feature', d,);

  if (map.value?.component) {
    const mapComponent = map.value.component as any;

    console.log(mapComponent, 'mapComponent')
  }
};

// Handler for clicking on points
const handlePointClick = (d: any) => {
  console.log('Clicked Point', d);
  clickedPoint.value = d;

  // Zoom to the clicked point by using fitToPoints with just that point
  // Note: TopoJSONMap doesn't have zoomToPointById, but we can use internal methods
  if (map.value?.component) {
    // Access the internal _fitToPoints method
    (map.value.component as any)._fitToPoints([d], 0.1);
  }
};

console.log(props.data);
</script>

<template>
  <div>
    <VisSingleContainer
      height="100vh"
      :duration="600"
      :data="{
        areas: areas,
        points: [
          {
            id: 'ams',
            latitude: 54,
            longitude: 4.95035,
            label: 'Amsterdam',
            color: 'transparent',
          },
        ],
      }"
    >
      <VisTopoJSONMap
        ref="map"
        :topojson="data"
        :zoom-factor="2"
        :pointRadius="pointRadius"
        :point-label="(d: any) => d.label"
        :map-feature-name="mapFeatureKey"
        :events="{
          [TopoJSONMap.selectors.feature]: {
            click: handleFeatureClick,
            mouseenter: (d: any) => {
              if (d.id === 'US') hoveredArea = 'US';
            },
            mouseleave: (d: any) => {
              if (d.id === 'US') hoveredArea = null;
            },
          },
          [TopoJSONMap.selectors.point]: {
            click: handlePointClick,
          },
        }"
      />
      <VisTooltip :triggers="tooltipTriggers" />
    </VisSingleContainer>

    <!-- <VisSingleContainer :height="800">
      <VisTopoJSONMap :topojson="usa" mapFeatureName="usa" />
    </VisSingleContainer> -->
  </div>
</template>
