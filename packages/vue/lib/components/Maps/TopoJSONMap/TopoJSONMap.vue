<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, useTemplateRef, useSlots } from "vue";
import { VisSingleContainer, VisTopoJSONMap, VisTooltip } from "@unovis/vue";
import { MapsData } from "./types";
import { TopoJSONMap } from "@unovis/ts";
import Tooltip from "../../Tooltip.vue";
import { MapPoint } from "../types";

const props = withDefaults(defineProps<MapsData<T>>(), {
  zoomFactor: 1,
});

const emit = defineEmits<{
  (e: "mouseenter", d: any): void;
  (e: "mouseleave", d: any): void;
}>();

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

function generateTooltipContent(d: any): string | undefined {
  if (typeof window === "undefined") {
    return "";
  }

  const data = hoverValues.value;
  if (!data) return undefined;

  const title = getTitle(data);
  if (!title || (typeof title === "string" && title.trim() === "")) {
    return undefined;
  }

  if (slots.tooltip && slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }

  const categories = props.categories ?? {};
  const entries = Object.entries(data).filter(([key]) => categories[key]);
  
  let html = `<div style="display: flex; flex-direction: column;">`;
  html += `<div style="color: #000; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 0.75rem 0.5rem 0.75rem; margin-bottom: 0.25rem; font-size: 0.875rem;">${title}</div>`;

  if (entries.length > 0) {
    html += `<div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.25rem 0.5rem; padding: 0 0.75rem 0.5rem 0.75rem;">`;
    entries.forEach(([key, value], i) => {
      const cat = categories[key];
      const color = cat.color ?? `var(--vis-color${i})`;
      html += `
        <span style="width: 8px; height: 8px; border-radius: 4px; background-color: ${color}"></span>
        <span style="font-size: 0.875rem; margin-right: 1rem; white-space: nowrap;">${cat.name}</span>
        <span style="font-size: 0.875rem; font-weight: 600; text-align: right; font-variant-numeric: tabular-nums;">${
          props.yFormatter ? props.yFormatter(value as any) : value
        }</span>
      `;
    });
    html += `</div>`;
  }
  html += `</div>`;

  return html;
}

const tooltipTriggers = {
  [TopoJSONMap.selectors.feature]: (d: any) => {
    const datum = d.data ?? d.datum ?? {};
    const properties = d.properties ?? {};
    hoverValues.value = { ...properties, ...datum, ...d };
    return generateTooltipContent(d);
  },
  [TopoJSONMap.selectors.point]: (d: any) => {
    hoverValues.value = d;
    return generateTooltipContent(d);
  },
};

// The VisTopoJSONMap exposes a component property with the TopoJSONMap instance
const map = useTemplateRef<{ component: TopoJSONMap<any, any, any> }>("map");

const pointLabel = (d: MapPoint) => d.label;
const pointRadius = (d: MapPoint) =>  5;

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
  clickedPoint.value = d;

  // Zoom to the clicked point by using fitToPoints with just that point
  // Note: TopoJSONMap doesn't have zoomToPointById, but we can use internal methods
  if (map.value?.component) {
    // Access the internal _fitToPoints method
    (map.value.component as any)._fitToPoints([d], 0.1);
  }
};

const getTitle = (d: any) => {
  if (props.tooltipTitleFormatter) {
    return props.tooltipTitleFormatter(d);
  }
  if (!d) return "";
  const properties = d?.properties ?? {};
  return properties.name ?? "";
};

const mapsData = computed(() => props.data);
</script>

<template>
  <VisSingleContainer
    :duration="600"
    :data="mapsData"
    :height="props.height"
    :width="props.width"
  >
    <VisTopoJSONMap
      ref="map"
      :data="mapsData.areas"
      :point-data="mapsData.points"
      :topojson="props.topojson"
      :projection="props.projection"
      :zoom-factor="props.zoomFactor"
      :pointLabel="pointLabel"
      :pointRadius="pointRadius"
      :areaColor="props.areaColor"
      :areaCursor="props.areaCursor"
      :map-feature-name="props.mapFeatureKey"
      :events="{
        [TopoJSONMap.selectors.feature]: {
          click: handleFeatureClick,
          mouseover: (d: any) => emit('mouseenter', d),
          mouseout: (d: any) => emit('mouseleave', d),
        },
        [TopoJSONMap.selectors.point]: {
          click: handlePointClick,
        },
      }"
    />
    <VisTooltip
      v-if="!props.hideTooltip"
      :triggers="tooltipTriggers"
    />
  </VisSingleContainer>

  <div ref="slotWrapper" style="display: none">
    <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
    <slot v-else-if="hoverValues" name="fallback">
      <Tooltip 
        :data="hoverValues"
        :categories="props.categories ?? {}"
        :title-formatter="props.tooltipTitleFormatter ?? getTitle"
        :y-formatter="props.yFormatter"
      />
    </slot>
  </div>
</template>
