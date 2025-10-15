<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed } from "vue";
import { VisSingleContainer, VisTopoJSONMap, VisTooltip } from "@unovis/vue";
import { MapsData } from "./types";
import { TopoJSONMap } from "@unovis/ts";

const props = defineProps<MapsData<T>>();

const tooltipTriggers = {
  [TopoJSONMap.selectors.feature]: (d: T) => `${d.properties.name}`,
};

const pointRadius = (d: any) => 5;

const hoveredArea = ref<string | null>(null);
const areas = computed(() =>
  hoveredArea.value === "US" ? [{ id: "US", color: "red" }] : []
);

console.log(props.data);
</script>

<template>
  <div class="bg-white p-48">
    <VisSingleContainer :height="800" :duration="600">
      <VisTopoJSONMap
        :topojson="data"
        :pointRadius="pointRadius"
        :point-label="(d: any) => d.label"
        :map-feature-name="mapFeatureKey"
        :events="{
          [TopoJSONMap.selectors.feature]: {
            mouseenter: (d: any) => {
              if (d.id === 'US') hoveredArea = 'US';
            },
            mouseleave: (d: any) => {
              if (d.id === 'US') hoveredArea = null;
            },
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
