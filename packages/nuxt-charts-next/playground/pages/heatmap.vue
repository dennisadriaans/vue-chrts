<script setup lang="ts">
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, hour) => hour);

const traffic = days.flatMap((day, dayIndex) =>
  hours.map((hour) => {
    const workday = dayIndex < 5 ? 1 : 0.45;
    const daylight = Math.max(0, Math.sin(((hour - 6) / 16) * Math.PI));
    return { day, hour, visits: Math.round(40 + 900 * workday * daylight * (0.8 + ((dayIndex * 7 + hour) % 5) / 10)) };
  }),
);

const sparse = traffic.filter((row) => (row.hour + row.day.length) % 4 !== 0);
</script>

<template>
  <main style="font-family: sans-serif; max-width: 860px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Heatmap charts</h1>

    <h2>Traffic by weekday and hour</h2>
    <HeatmapChart
      :data="traffic"
      x-axis="hour"
      y-axis="day"
      value-key="visits"
      :x-label-every="3"
      :x-formatter="(hour) => `${hour}:00`"
      :value-formatter="(value) => `${value} visits`"
      aria-label="Visits by weekday and hour"
    />

    <h2>Linear scale, custom colours and missing cells</h2>
    <HeatmapChart
      :data="sparse"
      x-axis="hour"
      y-axis="day"
      value-key="visits"
      scale="linear"
      :steps="4"
      :color-range="['#fff7ed', '#ea580c']"
      :cell-gap="2"
      :x-label-every="6"
      empty-label="No visits recorded"
    />
  </main>
</template>
