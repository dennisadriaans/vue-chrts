<script setup lang="ts" generic="T extends {} = {}">
import { Position, Scale, Scatter } from "@unovis/ts";
import {
  VisXYContainer,
  VisScatter,
  VisAxis,
  VisTooltip,
  VisBulletLegend,
} from "@unovis/vue";
import { BubbleChartProps, DataRecord } from "./types";
import { LegendPosition } from "../../types";

import type { NumericAccessor, StringAccessor } from "@unovis/ts";

const props = withDefaults(defineProps<BubbleChartProps<T>>(), {
  hideXAxis: false,
  hideYAxis: false,
  xLabel: "",
  yLabel: "",
  xGridLine: false,
  yGridLine: true,
  xDomainLine: true,
  yDomainLine: true,
  xTickLine: true,
  yTickLine: true,
  xNumTicks: undefined,
  yNumTicks: undefined,
  xExplicitTicks: undefined,
  minMaxTicksOnly: false,
  hideLegend: false,
  legendPosition: LegendPosition.Bottom,
});

const legendItems = [
  { name: "Male", color: "#1fc3aa" },
  { name: "Female", color: "#8624F5" },
  { name: "No Data", color: "#aaa" },
];

const x: NumericAccessor<DataRecord> = (d) => d.beakLength;
const y: NumericAccessor<DataRecord> = (d) => d.flipperLength;
const color: StringAccessor<DataRecord> = (d) =>
  legendItems.find((i) => i.name === (d.sex ?? "No Data"))?.color;

const triggers = {
  [Scatter.selectors.point]: (d: any) => `
      ${d.major}<br/>Number of graduates: ${d.total.toLocaleString()}
    `,
};

const VisScatterLabel: string = 'test label'
</script>

<template>
  <h2>American College Graduates, 2010-2012</h2>
  <div
    v-if="!props.hideLegend"
    class="flex items-center justify-end"
    :class="{ 'pb-4': props.legendPosition === LegendPosition.Top }"
  >
    <VisBulletLegend :items="legendItems" />
  </div>
  <VisXYContainer :data="props.data" :height="600" :scaleByDomain="true">
    <VisScatter
      :x="x"
      :y="y"
      :color="color"
      :size="1"
      :label="VisScatterLabel"
      :labelPosition="Position.Bottom"
      :sizeRange="[1, 20]"
      cursor="pointer"
    />
    <VisAxis
      v-if="!props.hideXAxis"
      type="x"
      :label="props.xLabel"
      :tickFormat="props.xFormatter"
      :gridLine="props.xGridLine"
      :domainLine="!!props.xDomainLine"
      :tickLine="props.xTickLine"
      :numTicks="props.xNumTicks"
    />
    <VisAxis
      v-if="!props.hideYAxis"
      type="y"
      :label="props.yLabel"
      :tickFormat="props.yFormatter"
      :gridLine="props.yGridLine"
      :domainLine="!!props.yDomainLine"
      :tickLine="props.yTickLine"
      :numTicks="props.yNumTicks"
    />
    <VisTooltip :triggers="triggers" />
  </VisXYContainer>
</template>
