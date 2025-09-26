<script setup lang="ts">
import {
  VisXYContainer,
  VisStackedBar,
  VisAxis,
  VisBulletLegend,
  VisXYLabels,
} from "@unovis/vue";
import { data, capitalize, colors, ElectionDatum } from "./../data";

const items = Object.entries(colors).map(([n, c]) => ({
  name: capitalize(n),
  color: c,
}));
const x = (d: ElectionDatum) => d.year;
const y = [(d: ElectionDatum) => d.republican];
const color = (d: ElectionDatum, i: number) => items[i].color;

 enum XYLabelPositioning {
  AbsolutePx = 'absolute_px',
  AbsolutePercentage = 'absolute_percentage',
  DataSpace = 'data_space',
}

</script>

<template>
  <h2>U.S. Election Popular Vote Results by Political Party</h2>
  <VisBulletLegend :items="items" />
  <VisXYContainer
    :height="500"
    :padding="{
      top: 30,
    }"
  >
    <VisStackedBar :data="data" :x="x" :y="y" :color="color" />
    <div class="py-4">
      <VisXYLabels
        :data="data"
        :y="(d) => d.republican * 1.05"
        :x="(d) => d.year "
        :label="(d) => `bps 123`"
      />
    </div>

    <VisAxis type="x" label="Election Year" :numTicks="data.length" />
    <VisAxis
      type="y"
      :tickFormat="(value) => (value / 10 ** 6).toFixed(1)"
      label="Number of Votes (millions)"
    />
  </VisXYContainer>
</template>
