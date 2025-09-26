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

// Define a consistent pixel offset for the label above the bar end
const PIXEL_OFFSET = 50000000000; // Negative value moves the label up by 5 pixels

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

    <VisXYLabels
      :data="data"
      :x="(d) => d.year" 
      :y="(d) => d.republican" 
      :label="(d) => `bps 123`"
    />

    <VisAxis type="x" label="Election Year" :numTicks="data.length" />
    <VisAxis
      type="y"
      :tickFormat="(value) => (value / 10 ** 6).toFixed(1)"
      label="Number of Votes (millions)"
    />
  </VisXYContainer>
</template>