<script setup lang="ts" generic="T">
import { computed, getCurrentInstance, ref, toRaw, useSlots, useTemplateRef } from "vue";
import { type NumericAccessor, CurveType, Position } from "@unovis/ts";
import { createScopedMarkers } from "../../utils";

import Tooltip from "../Tooltip.vue";

import {
  VisArea,
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisTooltip,
  VisXYLabels,
  VisXYContainer,
} from "@unovis/vue";

import { LegendPosition } from "../../enums";
import type { AreaChartProps } from "./AreaChart";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

const DEFAULT_OPACITY = 0.5;
const DEFAULT_COLOR = "#3b82f6";
const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  x: (_d: T, i: number) => i,
  duration: 600,
  padding: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  showLabels: false,
  crosshairConfig: () => ({
    color: "#666",
  }),
  lineWidth: 2,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  hideLegend: false,
  hideArea: false,
  gradientStops: () => [
    { offset: "0%", stopOpacity: 1 },
    { offset: "75%", stopOpacity: 0 },
  ],
  tooltip: () => ({
    followCursor: true,
  }),
});

const labelConfig = computed(() => {
  if (!props.showLabels && !props.labelConfig) return undefined;

  const config = props.labelConfig ?? ({} as any);

  // XYLabels calls accessors without passing the index, so we need
  // an x accessor that can recover the index from the data array itself.
  // Use toRaw to unwrap Vue proxies for reliable identity-based lookups.
  const indexMap = new WeakMap<object, number>();
  const rawData = toRaw(props.data);
  rawData.forEach((d, i) => indexMap.set(toRaw(d as object), i));

  const labelX = config.x ?? ((d: T) => {
    const index = indexMap.get(toRaw(d as object)) ?? 0;
    return typeof props.x === 'function'
      ? (props.x as (d: T, i: number) => number)(d, index)
      : index;
  });

  return {
    ...config,
    label: config.label ?? ((d: T, i: number, cat: string) => String((d as any)[cat])),
    x: labelX,
    y: (cat: string) => {
      if (config.y) return (d: T, i: number) => config.y!(d, i, cat);
      if (props.stacked) {
        return (d: T, i: number) => {
          const keys = Object.keys(props.categories);
          const index = keys.indexOf(cat);
          let sum = 0;
          for (let j = 0; j <= index; j++) {
            sum += Number((d as any)[keys[j]]) || 0;
          }
          return sum;
        };
      }
      return (d: T) => Number((d as any)[cat]);
    },
    color: config.color ?? ((d: T, i: number, cat: string) => {
      const index = Object.keys(props.categories).indexOf(cat);
      return colors.value[index] ?? DEFAULT_COLOR;
    }),
  };
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

const categoryKeys = computed(() => Object.keys(props.categories));

const markerScopeId = `area-${getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2)}`;

const colors = computed(() => {
  const defaultColors = Object.values(props.categories).map(
    (_, index) => `var(--vis-color${index})`
  );
  return Object.values(props.categories).map(
    (c, i) => c.color ?? defaultColors[i]
  );
});

const yNumTicks = computed(() => {
  if (props.yNumTicks !== undefined) return props.yNumTicks;
  return Math.max(2, Object.keys(props.categories ?? {}).length);
});

const markersSvgDefs = computed(() => {
  if (!props.markerConfig?.config) return "";
  return createScopedMarkers(props.markerConfig, markerScopeId, {
    includeLegacy: true,
  });
});

const markerCssVars = computed<Record<string, string>>(() => {
  if (!props.markerConfig?.config) return {};

  const vars: Record<string, string> = {};
  for (const key of Object.keys(props.markerConfig.config)) {
    vars[`--vis-marker-${key}`] = `url(\"#${props.markerConfig.id}--${markerScopeId}--${key}\")`;
  }
  return vars;
});

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

const svgDefs = computed(() => {
  return colors.value
    .map((color, index) => {
      const id = `gradient-${markerScopeId}-${index}`;
      const stops =
        props.gradientStops
          ?.map(
            (stop) =>
              `<stop offset="${stop.offset}" stop-color="${color}" stop-opacity="${stop.stopOpacity}" />`
          )
          .join("") ?? "";

      return `
    <linearGradient id="${id}" gradientTransform="rotate(90)">
      ${stops}
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
  `;
    })
    .join("");
});

function getAccessors(id: string): {
  y: NumericAccessor<T>;
  color: string | string[];
} {
  return {
    y: (d: T) => Number(d[id as keyof T]),
    color: props.categories[id]?.color ?? DEFAULT_COLOR,
  };
}

// Stacked area accessors - returns an array of y accessors for all categories
const stackedYAccessors = computed(() => {
  return Object.keys(props.categories).map(
    (categoryId) => (d: T) => Number(d[categoryId as keyof T])
  );
});

// Stacked line accessors - returns cumulative values for proper line positioning
const stackedLineYAccessors = computed(() => {
  const categoryKeys = Object.keys(props.categories);
  return categoryKeys.map((_, index) => {
    return (d: T) => {
      // Sum all values from index 0 to current index (cumulative)
      let sum = 0;
      for (let i = 0; i <= index; i++) {
        sum += Number(d[categoryKeys[i] as keyof T]) || 0;
      }
      return sum;
    };
  });
});

// Stacked color accessor - returns color based on index
const stackedColorAccessor = computed(() => {
  return (_d: T, i: number) => colors.value[i] ?? DEFAULT_COLOR;
});

function generateTooltipContent(d: T): string {
  if (typeof window === "undefined") {
    return "";
  }
  if (slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }
  return "";
}

function onCrosshairUpdate(d: T): string {
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
    :class="{ 'stacked-area-chart': stacked }"
    :id="markerConfig?.id"
    @click="emit('click', $event, hoverValues)"
  >
    <VisXYContainer
      :data="data"
      :height="height"
      :duration="duration"
      :padding="padding"
      :svg-defs="svgDefs + markersSvgDefs"
      :y-domain="yDomain"
      :x-domain="xDomain"
    >
      <VisTooltip
        v-if="!hideTooltip"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
        :follow-cursor="props.tooltip.followCursor"
        :show-delay="props.tooltip.showDelay"
        :hide-delay="props.tooltip.hideDelay"
      />

      <!-- Stacked Area Mode: Single VisArea with array of y accessors -->
      <template v-if="stacked">
        <VisArea
          v-if="!hideArea"
          :x="x"
          :y="stackedYAccessors"
          :color="stackedColorAccessor"
          :opacity="DEFAULT_OPACITY"
          :curve-type="curveType ?? CurveType.MonotoneX"
        />
        <VisLine
          :x="x"
          :y="stackedLineYAccessors"
          :color="stackedColorAccessor"
          :curve-type="curveType ?? CurveType.MonotoneX"
          :line-width="lineWidth"
        />
      </template>

      <!-- Non-Stacked Mode: Overlapping areas (original behavior) -->
      <template v-else>
        <template
          v-for="(categoryId, index) in Object.keys(props.categories)"
          :key="categoryId"
        >
          <VisArea
            v-if="!hideArea"
            :x="x"
            v-bind="getAccessors(categoryId)"
            :color="`url(#gradient-${markerScopeId}-${index})`"
            :opacity="DEFAULT_OPACITY"
            :curve-type="curveType ?? CurveType.MonotoneX"
          />
          <VisLine
            :x="x"
            :y="(d: T) => d[categoryId as keyof T]"
            :color="colors[index]"
            :curve-type="curveType ?? CurveType.MonotoneX"
            :line-width="lineWidth"
            :lineDashArray="lineDashArray ? lineDashArray[index] : undefined"
          />
        </template>
      </template>

      <VisAxis
        v-if="!hideXAxis"
        type="x"
        :label="xLabel"
        :label-margin="8"
        :num-ticks="xNumTicks"
        :tick-format="xFormatter"
        :tick-values="xExplicitTicks"
        :grid-line="xGridLine"
        :domain-line="xDomainLine"
        :tick-line="xTickLine"
        :min-max-ticks-only="minMaxTicksOnly"
        :duration="duration"
        v-bind="xAxisConfig"
      />

      <VisAxis
        v-if="!hideYAxis"
        type="y"
        :label="yLabel"
        :num-ticks="yNumTicks"
        :tick-format="yFormatter"
        :tick-values="yExplicitTicks"
        :grid-line="yGridLine"
        :domain-line="yDomainLine"
        :tick-line="yTickLine"
        :duration="duration"
        v-bind="yAxisConfig"
      />

      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdate"
      />

      <template v-if="labelConfig">
        <VisXYLabels
          v-for="categoryId in Object.keys(props.categories)"
          :key="categoryId"
          :x="labelConfig.x"
          :y="labelConfig.y(categoryId)"
          :label="(d: T, i: number) => labelConfig.label!(d, i, categoryId)"
          :color="(d: T, i: number) => 
            typeof labelConfig.color === 'function' 
              ? labelConfig.color(d, i, categoryId) 
              : labelConfig.color"
          :label-font-size="typeof labelConfig.fontSize === 'function'
            ? (d: T, i: number) => (labelConfig.fontSize as Function)(d, i, categoryId)
            : labelConfig.fontSize"
          :background-color="labelConfig.backgroundColor"
          :clustering="labelConfig.clustering ?? false"
          :cluster-label="labelConfig.clusterLabel"
          :events="labelConfig.events ?? {}"
          :attributes="labelConfig.attributes ?? {}"
        />
      </template>
      
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
          :followCursor="false"
          :categories="categories"
          :title-formatter="props.tooltipTitleFormatter"
          :yFormatter="props.yFormatter"
        />
      </slot>
    </div> 
  </div>
</template>

