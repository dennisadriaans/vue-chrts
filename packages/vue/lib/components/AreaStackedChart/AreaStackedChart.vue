<script setup lang="ts" generic="T">
import {
  VisXYContainer,
  VisAxis,
  VisArea,
  VisBulletLegend,
  VisCrosshair,
} from "@unovis/vue";
import { BulletLegendItemInterface, CurveType } from "@unovis/ts";
import Tooltip from "../Tooltip.vue";
import { computed, createApp } from "vue";
import { AreaStackedChartProps } from "./types";

const props = defineProps<AreaStackedChartProps<T>>();

const onCrosshairUpdate = computed(() => (d: T, idx: number) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }

  try {
    const app = createApp(Tooltip, {
      data: d,
      categories: props.categories,
    });

    const container = document.createElement("div");
    app.mount(container);

    const html = container.innerHTML;
    app.unmount();

    return html;
  } catch (error) {
    return "";
  }
});

const x = (d: any) => {
  return Number.parseInt(d.time);
};
const y = [(d: any) => d.firstTime, (d: any) => d.returning];
</script>

<template>
  <div class="flex flex-col space-y-4">
    <VisXYContainer :data="data" :padding="padding" :height="height">
      <VisArea
        :x="x"
        :y="y"
        :color="Object.values(props.categories).map((i) => i.color)"
        :curve-type="CurveType.Linear"
      />
      <VisAxis type="x" label="Time" :num-ticks="12" />
      <VisAxis type="y" label="Number of visitors" :num-ticks="3" />
      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdate"
      />
    </VisXYContainer>
    <div class="flex items center justify-end">
      <VisBulletLegend :items="Object.values(categories)" />
    </div>
  </div>
</template>
