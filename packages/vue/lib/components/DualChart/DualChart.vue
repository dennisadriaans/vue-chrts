<script setup lang="ts" generic="T extends {}">
import { computed, getCurrentInstance, ref, useSlots, useTemplateRef } from "vue";
import { GroupedBar, StackedBar, Orientation, CurveType, Position } from "@unovis/ts";
import { createScopedMarkers } from "../../utils";

import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisStackedBar,
  VisLine,
  VisArea,
  VisTooltip,
  VisXYContainer,
  VisCrosshair,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";

import { LegendPosition } from "../../types";
import { DualChartProps } from "./types";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

const DEFAULT_OPACITY = 0.5;
const DEFAULT_COLOR = "#3b82f6";
const props = withDefaults(defineProps<DualChartProps<T>>(), {
  orientation: Orientation.Vertical,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  hideLegend: false,
  yGridLine: true,
  groupPadding: 0,
  barPadding: 0.2,
  padding: () => ({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  }),
  hideTooltip: false,
  lineWidth: 2,
  curveType: CurveType.MonotoneX,
  hideArea: false,
  gradientStops: () => [
    { offset: "0%", stopOpacity: 1 },
    { offset: "75%", stopOpacity: 0 },
  ],
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

// Validate required props
if (!props.barYAxis || props.barYAxis.length === 0) {
  console.error('[DualChart] barYAxis prop is required and must contain at least one field key');
  throw new Error("DualChart: 'barYAxis' is required and must contain at least one field key. Provide an array of property keys from your data type (e.g., ['revenue', 'costs'])");
}

if ((!props.lineYAxis || props.lineYAxis.length === 0) && (!props.areaYAxis || props.areaYAxis.length === 0)) {
  console.error('[DualChart] Either lineYAxis or areaYAxis prop is required and must contain at least one field key');
  throw new Error("DualChart: Either 'lineYAxis' or 'areaYAxis' is required and must contain at least one field key. Provide an array of property keys from your data type (e.g., ['profit', 'target'])");
}

// Bar chart accessors
const barYAxisAccessors = computed(() => {
  return props.barYAxis.map((key) => (d: T) => {
    return d[key];
  });
});

// Line chart accessors
const lineYAxisAccessors = computed(() => {
  return props.lineYAxis?.map((key) => (d: T) => {
    return d[key];
  }) || [];
});

// Area chart accessors
const areaYAxisAccessors = computed(() => {
  return props.areaYAxis?.map((key) => (d: T) => {
    return d[key];
  }) || [];
});

// Bar color accessor
const barColor = (_: T, i: number) => Object.values(props.barCategories)[i]?.color;

// Line color accessor
const lineColor = (_: T, i: number) => Object.values(props.lineCategories || {})[i]?.color;

// Area color accessor
const areaColor = (_: T, i: number) => Object.values(props.areaCategories || {})[i]?.color || DEFAULT_COLOR;

// Marker scope for area charts
const markerScopeId = `dual-area-${getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2)}`;

// Area colors for gradients
const areaColors = computed(() => {
  if (!props.areaCategories) return [];
  const defaultColors = Object.values(props.areaCategories).map(
    (_, index) => `var(--vis-color${index})`
  );
  return Object.values(props.areaCategories).map(
    (c, i) => c.color ?? defaultColors[i]
  );
});

// Helper function to sanitize color strings for use in IDs
const sanitizeColorForId = (color: string | string[]) => {
  const colorStr = Array.isArray(color) ? color[0] : color;
  return colorStr.replace(/[^a-zA-Z0-9-]/g, '');
};

// Sanitized color IDs for gradient references
const areaGradientIds = computed(() => {
  return areaColors.value.map((color, index) => 
    `gradient${index}-${sanitizeColorForId(color)}`
  );
});

// Marker SVG definitions
const markersSvgDefs = computed(() => {
  if (!props.markerConfig?.config) return "";
  return createScopedMarkers(props.markerConfig, markerScopeId, {
    includeLegacy: true,
  });
});

// Marker CSS variables
const markerCssVars = computed<Record<string, string>>(() => {
  if (!props.markerConfig?.config) return {};

  const vars: Record<string, string> = {};
  for (const key of Object.keys(props.markerConfig.config)) {
    vars[`--vis-marker-${key}`] = `url("#${props.markerConfig.id}--${markerScopeId}--${key}")`;
  }
  return vars;
});

// SVG gradient definitions for area charts
const svgDefs = computed(() => {
  if (!props.areaCategories) return "";
  
  const sanitizeColorForId = (color: string | string[]) => {
    const colorStr = Array.isArray(color) ? color[0] : color;
    return colorStr.replace(/[^a-zA-Z0-9-]/g, '');
  };
  
  const createGradientWithHex = (id: number, color: string | string[]) => {
    const sanitizedId = sanitizeColorForId(color);
    return `
    <linearGradient id="gradient${id}-${sanitizedId}" gradientTransform="rotate(90)">
      ${
        props.gradientStops
          ?.map(
            (stop) =>
              `<stop offset="${stop.offset}" stop-color="${color}" stop-opacity="${stop.stopOpacity}" />`
          )
          .join("") ?? ""
      }
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  `;
  };
  const createGradientWithCssVar = (id: number, color: string | string[]) => {
    const sanitizedId = sanitizeColorForId(color);
    return `
    <linearGradient id="gradient${id}-${sanitizedId}" gradientTransform="rotate(90)">
    ${
      props.gradientStops
        ?.map(
          (stop) => `
      <stop offset="${stop.offset}" style="stop-color:var(${color});stop-opacity:${stop.stopOpacity}" />
    `
        )
        .join("") ?? ""
    }
    </linearGradient>
  `;
  };
  return areaColors.value
    .map((color, index) =>
      color?.includes("#")
        ? createGradientWithHex(index, color)
        : createGradientWithCssVar(index, color ?? DEFAULT_COLOR)
    )
    .join("");
});

// Combined categories for legend
const allCategories = computed(() => ({
  ...props.barCategories,
  ...(props.lineCategories || {}),
  ...(props.areaCategories || {}),
}));

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function onCrosshairUpdate(d: T) {
  hoverValues.value = d;
}

function generateTooltipContent(d: T): string {
  if (typeof window === "undefined") {
    return "";
  }
  if (slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }
  return "";
}

function onCrosshairUpdateWithContent(d: T): string {
  hoverValues.value = d;
  return generateTooltipContent(d);
}
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
      ...markerCssVars,
    }"
    :id="markerConfig?.id"
    @click="emit('click', $event, hoverValues)"
  >
    <VisXYContainer 
      :padding="padding" 
      :height="height" 
      :data="data"
      :svg-defs="svgDefs + markersSvgDefs"
    >
      <VisTooltip
        v-if="!hideTooltip"
        :triggers="{
          [GroupedBar.selectors.bar]: (d: T) => {
            onCrosshairUpdate(d);
            return d ? slotWrapperRef?.innerHTML : '';
          },
          [StackedBar.selectors.bar]: (d: T) => {
            onCrosshairUpdate(d);
            return d ? slotWrapperRef?.innerHTML : '';
          },
        }"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />

      <!-- Bar Chart Component -->
      <VisGroupedBar
        v-if="!stacked"
        :data="data"
        :x="(_: T, i: number) => i"
        :y="barYAxisAccessors"
        :color="barColor"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />
      <VisStackedBar
        v-else
        :data="data"
        :x="(_: T, i: number) => i"
        :y="barYAxisAccessors"
        :color="barColor"
        :rounded-corners="radius ?? 0"
        :group-padding="groupPadding ?? 0"
        :bar-padding="barPadding ?? 0.2"
        :orientation="orientation ?? Orientation.Vertical"
      />

      <!-- Line Chart Component(s) -->
      <VisLine
        v-for="(lineAccessor, index) in lineYAxisAccessors"
        :key="`line-${index}`"
        :data="data"
        :x="(_: T, i: number) => i"
        :y="lineAccessor"
        :color="Object.values(props.lineCategories || {})[index]?.color"
        :curve-type="curveType ?? CurveType.MonotoneX"
        :line-width="lineWidth"
      />

      <!-- Area Chart Component(s) -->
      <template v-if="areaYAxis && areaYAxis.length > 0">
        <template
          v-for="(areaAccessor, index) in areaYAxisAccessors"
          :key="`area-${index}`"
        >
          <VisArea
            :data="data"
            :x="(_: T, i: number) => i"
            :y="areaAccessor"
            :color="`url(#${areaGradientIds[index]})`"
            :opacity="hideArea ? 0 : DEFAULT_OPACITY"
            :curve-type="curveType ?? CurveType.MonotoneX"
          />
          <VisLine
            :data="data"
            :x="(_: T, i: number) => i"
            :y="areaAccessor"
            :color="areaColors[index]"
            :curve-type="curveType ?? CurveType.MonotoneX"
            :line-width="lineWidth"
            :lineDashArray="lineDashArray ? lineDashArray[index] : undefined"
          />
        </template>
      </template>

      <VisAxis
        v-if="!hideXAxis"
        type="x"
        :tick-format="xFormatter"
        :label="xLabel"
        :grid-line="xGridLine"
        :domain-line="!!xDomainLine"
        :tick-line="xTickLine"
        :num-ticks="xNumTicks"
        :tick-values="xExplicitTicks"
        :minMaxTicksOnly="minMaxTicksOnly"
        v-bind="xAxisConfig"
      />
      <VisAxis
        v-if="!hideYAxis"
        type="y"
        :label="yLabel"
        :grid-line="orientation !== Orientation.Horizontal && yGridLine"
        :domain-line="!!yDomainLine"
        :tick-format="yFormatter"
        :num-ticks="yNumTicks"
        :tick-line="yTickLine"
        v-bind="yAxisConfig"
      />

      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdateWithContent"
      />
    </VisXYContainer>
    
    <div
      v-if="!props.hideLegend"
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
          Object.values(allCategories).map((item) => ({
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
          :categories="allCategories"
          :title-formatter="props.tooltipTitleFormatter"
          :yFormatter="
            props.orientation === Orientation.Horizontal
              ? props.xFormatter
              : props.yFormatter
          "
        />
      </slot>
    </div>
  </div>
</template>
