<script setup lang="ts">
interface SalesVolumeDataItem {
  month: string;
  volume: number;
}

const chartData: SalesVolumeDataItem[] = [
  { month: "Jan", volume: 18000 },
  { month: "Jan", volume: 34000 },
  { month: "Feb", volume: 28000 },
  { month: "Feb", volume: 42000 },
  { month: "Mar", volume: 42000 },
  { month: "Mar", volume: 52000 },
  { month: "Apr", volume: 76000 },
  { month: "Apr", volume: 45000 },
  { month: "May", volume: 56000 },
  { month: "May", volume: 98000 },
  { month: "Jun", volume: 77000 },
  { month: "Jun", volume: 68000 },
  { month: "Jul", volume: 108000 },
];

const categories: Record<string, BulletLegendItemInterface> = {
  volume: {
    name: "Sales volume",
    color: "var(--ui-primary)",
  },
};

const monthTicks: Record<number, string> = {
  0: "Jan",
  2: "Feb",
  4: "Mar",
  6: "Apr",
  8: "May",
  10: "Jun",
  12: "Jul",
};

const xFormatter = (tick: number): string => {
  return monthTicks[tick] ?? "";
};

const yFormatter = (value: number): string => {
  if (value === 0) return "";
  return `${(value / 1000).toFixed(0)}K`;
};

</script>

<template>
  <LineChart
    :data="chartData"
    :height="200"
    :categories="categories"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :curve-type="CurveType.Linear"
    :hide-legend="false"
    :x-grid-line="false"
    :y-grid-line="true"
    :x-domain-line="false"
    :y-domain-line="false"
    :x-tick-line="false"
    :y-tick-line="false"
    :x-num-ticks="7"
    :y-num-ticks="4"
    style="--vis-axis-grid-line-dasharray: 5 5"
  />
</template>
