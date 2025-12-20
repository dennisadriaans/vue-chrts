<script lang="ts" setup>

defineOptions({
  name: "TrafficPage",
});

const TrafficData = [
  {
    date: "2024-01-01",
    country: "USA",
    device: "Desktop",
    users: 576,
    unique_users: 389,
    sessions: 7,
    pages_per_session: 4.881913133722271,
    scroll_depth: 56.96127813915611,
    session_duration: 2,
  },
  {
    date: "2024-01-01",
    country: "USA",
    device: "Mobile",
    users: 748,
    unique_users: 504,
    sessions: 8,
    pages_per_session: 4.393721820350049,
    scroll_depth: 45.56902251132489,
    session_duration: 2,
  },
];

const categories: Record<string, BulletLegendItemInterface> = {
  users: { name: "Users", color: "#016538" },
  unique_users: { name: "Unique users", color: "#403e3e" },
};

const xFormatter = (i: number): string | number => `${TrafficData[i]?.date}`;
</script>

<template>
  <div>
    <BarChart
      :data="TrafficData"
      :height="220"
      :y-num-ticks="4"
      :y-axis="['users']"
      :group-padding="0.2"
      :categories="categories"
      :x-formatter="xFormatter"
      :grid-line-y="true"
      :legend-position="LegendPosition.Bottom"
    />
  </div>
</template>
