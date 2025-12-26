<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, useTemplateRef } from "vue";
import { VisSingleContainer, VisTopoJSONMap, VisTooltip } from "@unovis/vue";
import { MapsData } from "./types";
import { TopoJSONMap } from "@unovis/ts";

const props = withDefaults(
  defineProps<MapsData<T>>(),
  {
    zoomFactor: 1,
  }
);

const emit = defineEmits<{
  (e: "mouseenter", d: any): void;
  (e: "mouseleave", d: any): void;
}>();

const tooltipTriggers = {
  [TopoJSONMap.selectors.feature]: (d: T) => {
    const props = (d as any)?.properties ?? {};
    return `${props.name ?? props.statnaam ?? props.NAAM ?? (d as any)?.id ?? ''}`;
  },
};

// The VisTopoJSONMap exposes a component property with the TopoJSONMap instance
const map = useTemplateRef<{ component: TopoJSONMap<any, any, any> }>("map");

const pointRadius = (d: any) => 25;

const clickedPoint = ref<any>(null);



// Handler for clicking on map features (countries, areas, etc.)
const handleFeatureClick = (d: any, event: MouseEvent) => {
  console.log("Clicked Feature", d);

  if (map.value?.component) {
    const mapComponent = map.value.component as any;

    console.log(mapComponent, "mapComponent");
  }
};

// Handler for clicking on points
const handlePointClick = (d: any) => {
  console.log("Clicked Point", d);
  clickedPoint.value = d;

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
    :duration="600"
    :data="mapsData"
  >
    <VisTopoJSONMap
      ref="map"
      :data="mapsData.areas"
      :point-data="mapsData.points"
      :topojson="props.topojson"
      :zoom-factor="props.zoomFactor"
      :pointRadius="pointRadius"
      :point-label="(d: any) => d.label"
      :map-feature-name="mapFeatureKey"
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
