<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, useTemplateRef, useSlots } from "vue";
import { VisSingleContainer, VisTopoJSONMap, VisTooltip, VisBulletLegend } from "@unovis/vue";
import { MapsData } from "./types";
import { TopoJSONMap, Position } from "@unovis/ts";
import Tooltip from "../../Tooltip.vue";
import { MapArea, MapLink, MapPoint } from "../types";
import { LegendPosition } from "../../../types";

const props = withDefaults(defineProps<MapsData<T>>(), {
  zoomFactor: 1,
  pointSize: 5,
  legendPosition: LegendPosition.BottomCenter,
  hideLegend: false,
  duration: 600,
  padding: () => ({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  }),
});

const emit = defineEmits<{
  (e: "mouseenter", d: any): void;
  (e: "mouseleave", d: any): void;
  (e: "feature-click", d: any, event: MouseEvent): void;
  (e: "point-click", d: MapPoint, event: MouseEvent): void;
}>();

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

const isLegendTop = computed(() => props.legendPosition?.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition?.includes("left")) return "flex-start";
  if (props.legendPosition?.includes("right")) return "flex-end";
  return "center";
});

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

const pointLabel = (d: MapPoint) => (props.pointLabel ? props.pointLabel(d) : d.label);
const pointRadius = (d: MapPoint) => {
  if (typeof props.pointSize === "function") return props.pointSize(d);
  return props.pointSize ?? d.radius ?? 5;
};
const pointColor = (d: MapPoint) => {
  if (typeof props.pointColor === "function") return props.pointColor(d);
  return props.pointColor ?? d.color;
};
const linkColor = (d: MapLink) => {
  if (typeof props.linkColor === "function") return props.linkColor(d);
  const target = typeof d.source === "object" ? d.source : props.data.points?.find(p => p.id === d.target);
  return props.linkColor ?? d.color ?? (target as MapPoint)?.color;
};
const areaColor = (d: MapArea) => {
  if (typeof props.areaColor === "function") return props.areaColor(d);
  return props.areaColor ?? d.color;
};
const linkWidth = (d: MapLink) => {
  if (typeof props.linkWidth === "function") return props.linkWidth(d);
  return props.linkWidth ?? d.width ?? 1;
};

const clickedPoint = ref<any>(null);

// Handler for clicking on map features (countries, areas, etc.)
const handleFeatureClick = (d: any, event: MouseEvent) => {
  emit("feature-click", d, event);
};

// Handler for clicking on points
const handlePointClick = (d: MapPoint, event: MouseEvent) => {
  clickedPoint.value = d;
  emit("point-click", d, event);

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
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
  >
    <VisSingleContainer
      :duration="props.duration"
      :data="mapsData"
      :height="props.height"
      :width="props.width"
      :padding="props.padding"
    >
      <VisTopoJSONMap
        ref="map"
        :data="mapsData.areas"
        :point-data="mapsData.points"
        :link-data="mapsData.links"
        :topojson="props.topojson"
        :projection="props.projection"
        :zoom-factor="props.zoomFactor"
        :fitView="props.fitView"
        :fitViewPadding="props.fitViewPadding"
        :pointLabel="pointLabel"
        :pointRadius="pointRadius"
        :pointColor="pointColor"
        :pointCursor="props.pointCursor"
        :pointStrokeWidth="props.pointStrokeWidth"
        :linkColor="linkColor"
        :linkWidth="linkWidth"
        :linkCursor="props.linkCursor"
        :mapFitToPoints="props.mapFitToPoints"
        :areaColor="areaColor"
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

    <div
      v-if="props.categories && !props.hideLegend"
      :style="{
        display: 'flex',
        justifyContent: legendAlignment,
      }"
    >
      <VisBulletLegend
        :style="[
          props.legendStyle,
          'display: flex; gap: var(--vis-legend-spacing);',
        ]"
        :items="
          Object.values(props.categories).map((item) => ({
            ...item,
            color: Array.isArray(item.color) ? item.color[0] : item.color,
          }))
        "
      />
    </div>

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
  </div>
</template>
