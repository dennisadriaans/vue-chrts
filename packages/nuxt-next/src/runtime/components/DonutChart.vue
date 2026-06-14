<script setup lang="ts" generic="T">
/**
 * Donut chart adapter (maps onto the `vccs` Pie chart).
 *
 * Accepts the `nuxt-charts` v2 `DonutChartProps` config API: a `number[]` of
 * segment values plus a `categories` record for labels / colours. These are
 * zipped into `[{ name, value }]` objects for `<Pie>`, with one `<Cell>` per
 * segment carrying its colour. `DonutType.Half` renders a semicircle gauge.
 */
import { computed } from "vue";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "vccs";
import type { DonutChartProps } from "../types/charts";
import { DonutType } from "../enums";
import { categoriesToSeries } from "../utils/categories";
import { legendPositionToLegendProps } from "../utils/legend";
import { toCssProperties } from "../utils/style";

const props = defineProps<DonutChartProps<T>>();

/** Zip the value array against the categories record (positional, matching v2). */
const segments = computed(() => {
  const cats = categoriesToSeries(props.categories);
  return props.data.map((value, i) => ({
    name: cats[i]?.name ?? String(i),
    value,
    color: cats[i]?.color,
  }));
});

const innerRadius = computed(() =>
  props.arcWidth !== undefined ? Math.max(props.radius - props.arcWidth, 0) : props.radius * 0.6,
);

/** Half donut renders the top semicircle as a gauge. */
const angles = computed(() =>
  props.type === DonutType.Half
    ? { startAngle: 180, endAngle: 0 }
    : { startAngle: 0, endAngle: 360 },
);

const legend = computed(() => legendPositionToLegendProps(props.legendPosition));
const legendWrapperStyle = computed(() => toCssProperties(props.legendStyle));
</script>

<template>
  <ResponsiveContainer width="100%" :height="height ?? radius * 2">
    <PieChart>
      <Pie
        :data="segments"
        data-key="value"
        name-key="name"
        :inner-radius="innerRadius"
        :outer-radius="radius"
        :start-angle="angles.startAngle"
        :end-angle="angles.endAngle"
        :padding-angle="padAngle ?? 0"
        :is-animation-active="duration !== 0"
      >
        <Cell v-for="seg in segments" :key="seg.name" :fill="seg.color" />
      </Pie>
      <Tooltip v-if="!hideTooltip" />
      <Legend
        v-if="!hideLegend"
        :align="legend.align"
        :vertical-align="legend.verticalAlign"
        :layout="legend.layout"
        :wrapper-style="legendWrapperStyle"
      />
    </PieChart>
  </ResponsiveContainer>
</template>
