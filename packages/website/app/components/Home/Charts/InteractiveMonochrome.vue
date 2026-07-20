<script setup lang="ts">
const dataPoints = ref([
  { name: "Desktop", value: 45, color: "#06b6d4" },
  { name: "Mobile", value: 35, color: "#8b5cf6" },
  { name: "Tablet", value: 20, color: "#f97316" },
]);

const total = computed(() =>
  dataPoints.value.reduce((acc, curr) => acc + curr.value, 0),
);

const categories = computed(() =>
  Object.fromEntries(
    dataPoints.value.map((item) => [
      item.name,
      {
        name: item.name,
        color: item.color,
      },
    ]),
  ),
);

const randomizeData = () => {
  dataPoints.value = dataPoints.value.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 80) + 10,
  }));
};

const increaseDesktop = () => {
  const desktop = dataPoints.value[0];
  if (desktop) desktop.value += 10;
};

const decreaseDesktop = () => {
  const desktop = dataPoints.value[0];
  if (desktop && desktop.value > 10) desktop.value -= 10;
};
</script>

<template>
  <DonutChart
    :data="dataPoints.map((d) => d.value)"
    :categories="categories"
    :height="160"
    :arc-width="10"
    :pad-angle="2"
    :hide-legend="true"
  >
    <div class="flex flex-col items-center justify-center">
      <span class="text-3xl font-bold text-highlighted">{{ total }}</span>
      <span class="mt-1 text-xs font-medium uppercase tracking-wider text-muted"
        >Total</span
      >
    </div>
  </DonutChart>
</template>
