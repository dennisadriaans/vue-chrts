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

console.log(data, 'data')
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
      :x="(d) => {
        console.log(d.year);
        return d.year
      }"
      :labelFontSize="16"
      :label="(d) => `bps 123`"
      :y="
        (d) => {
          const sum = Object.keys(d)
            .filter((key) => key !== 'year')
            .reduce((accumulator, key) => accumulator + (d[key] ?? 0), 0);
          return sum + 1;
        }
      "
    >
    </VisXYLabels>

    <VisAxis type="x" label="Election Year" :numTicks="data.length" />
    <VisAxis
      type="y"
      :tickFormat="(value) => (value / 10 ** 6).toFixed(1)"
      label="Number of Votes (millions)"
    />
  </VisXYContainer>
</template>
