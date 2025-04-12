<script lang="ts" setup>
defineOptions({
  name: "HomePage",
});

interface AreaChartItem {
  date: string;
  desktop: number;
  mobile: number;
}

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#156F36" },
  mobile: { name: "Mobile", color: "#4ade80" },
};

const AreaChartData: AreaChartItem[] = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 180, mobile: 97 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 260, mobile: 240 },
  { date: "2024-04-05", desktop: 240, mobile: 290 },
];

const xFormatter = (i: number): string | number => `${AreaChartData[i]?.date}`;
</script>

<template>
  <AreaChart
    :data="AreaChartData"
    :height="275"
    :categories="categories"
    :grid-line-y="true"
    :x-formatter="xFormatter"
    :curve-type="CurveType.MonotoneX"
  />
</template>
