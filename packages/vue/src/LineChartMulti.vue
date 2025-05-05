<script lang="ts" setup>
import { LineChart, LegendPosition, CurveType } from "./../lib";

const SearchQueryData = [
  {
    date: "2023-01-01",
    impressions: 5300,
    clicks: 388,
    ctr: 7.32,
    averagePosition: 26.7,
  },
  {
    date: "2023-01-08",
    impressions: 6250,
    clicks: 472,
    ctr: 7.55,
    averagePosition: 25.5,
  },
  {
    date: "2023-01-15",
    impressions: 7050,
    clicks: 543,
    ctr: 7.7,
    averagePosition: 24.5,
  },
  {
    date: "2023-01-22",
    impressions: 7620,
    clicks: 583,
    ctr: 7.65,
    averagePosition: 23.8,
  },
  {
    date: "2023-01-29",
    impressions: 7900,
    clicks: 589,
    ctr: 7.46,
    averagePosition: 23.7,
  },
  {
    date: "2023-02-05",
    impressions: 8350,
    clicks: 618,
    ctr: 7.4,
    averagePosition: 23.5,
  },
  {
    date: "2023-02-12",
    impressions: 8050,
    clicks: 595,
    ctr: 7.39,
    averagePosition: 23.9,
  },
  {
    date: "2023-02-19",
    impressions: 8700,
    clicks: 652,
    ctr: 7.5,
    averagePosition: 23.6,
  },
  {
    date: "2023-02-26",
    impressions: 9120,
    clicks: 680,
    ctr: 7.46,
    averagePosition: 23.1,
  },
  {
    date: "2023-03-05",
    impressions: 9550,
    clicks: 725,
    ctr: 7.59,
    averagePosition: 22.8,
  },
  {
    date: "2023-03-12",
    impressions: 9300,
    clicks: 700,
    ctr: 7.53,
    averagePosition: 23.0,
  },
  {
    date: "2023-03-19",
    impressions: 9850,
    clicks: 748,
    ctr: 7.6,
    averagePosition: 22.5,
  },
  {
    date: "2023-03-26",
    impressions: 10200,
    clicks: 775,
    ctr: 7.6,
    averagePosition: 22.3,
  },
  {
    date: "2023-04-02",
    impressions: 10550,
    clicks: 790,
    ctr: 7.49,
    averagePosition: 22.0,
  },
  {
    date: "2023-04-09",
    impressions: 10300,
    clicks: 785,
    ctr: 7.62,
    averagePosition: 22.1,
  },
  {
    date: "2023-04-16",
    impressions: 10750,
    clicks: 820,
    ctr: 7.63,
    averagePosition: 21.8,
  },
  {
    date: "2023-04-23",
    impressions: 11000,
    clicks: 840,
    ctr: 7.64,
    averagePosition: 21.5,
  },
  {
    date: "2023-04-30",
    impressions: 10800,
    clicks: 815,
    ctr: 7.55,
    averagePosition: 21.7,
  },
  {
    date: "2023-05-07",
    impressions: 11250,
    clicks: 860,
    ctr: 7.64,
    averagePosition: 21.4,
  },
  {
    date: "2023-05-14",
    impressions: 11500,
    clicks: 880,
    ctr: 7.65,
    averagePosition: 21.2,
  },
  {
    date: "2023-05-21",
    impressions: 11350,
    clicks: 865,
    ctr: 7.62,
    averagePosition: 21.3,
  },
  {
    date: "2023-05-28",
    impressions: 11700,
    clicks: 895,
    ctr: 7.65,
    averagePosition: 21.0,
  },
  {
    date: "2023-06-04",
    impressions: 12000,
    clicks: 920,
    ctr: 7.67,
    averagePosition: 20.8,
  },
  {
    date: "2023-06-11",
    impressions: 11800,
    clicks: 900,
    ctr: 7.63,
    averagePosition: 20.9,
  },
  {
    date: "2023-06-18",
    impressions: 12250,
    clicks: 940,
    ctr: 7.67,
    averagePosition: 20.6,
  },
  {
    date: "2023-06-25",
    impressions: 12500,
    clicks: 960,
    ctr: 7.68,
    averagePosition: 20.4,
  },
];

const categories = {
  impressions: { name: "Impressions", color: "red" },
  clicks: { name: "Clicks", color: "orange" },
  ctr: { name: "CTR", color: "blue" },
  averagePosition: {
    name: "Average Position",
    color: "green",
  },
};

console.log(SearchQueryData);

const xFormatter = (i: number): string | number =>
  `${SearchQueryData[i]?.date}`;
</script>
<template>
    <LineChart
      :data="SearchQueryData"
      :height="500"
      y-label="Sales"
      :x-num-ticks="4"
      :y-num-ticks="4"
      :x-formatter="xFormatter"
      :categories="categories"
      :grid-line-y="true"
      :curve-type="CurveType.Linear"
      :legend-position="LegendPosition.Top"
    />
</template>
