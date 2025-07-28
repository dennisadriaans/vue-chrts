<script lang="ts" setup>
interface AreaChartItem {
  date: string;
  desktop: number;
  mobile: number;
}

const categories: ComputedRef<Record<string, BulletLegendItemInterface>> =
  computed(() => ({
    desktop: {
      name: "Desktop",
      color: "#3b82f6",
    },
    mobile: {
      name: "Mobile",
      color: "#22c55e",
    },
  }));

const AreaChartData: AreaChartItem[] = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 180, mobile: 97 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 260, mobile: 240 },
  { date: "2024-04-05", desktop: 240, mobile: 290 },
];

const xFormatter = (tick: number): string => {
  return `${AreaChartData[tick]?.date}`;
};
</script>

<template>
  <div>
    <ClientOnly>
      <AreaChart
        :data="AreaChartData"
        :height="300"
        :categories="categories"
        :y-grid-line="true"
        :x-formatter="xFormatter"
        :curve-type="CurveType.MonotoneX"
        :legend-position="LegendPosition.Top"
        :hide-legend="false"
      />
    </ClientOnly>
  </div>
</template>
