<script lang="ts" setup>
const win = 32;
const loss = 18;

const winLossData = [
  {
    name: "Winning",
    value: win,
  },
  {
    name: "Lost",
    value: loss,
  },
];

const percentage = Math.round((win / (win + loss)) * 100);

const categories = Object.fromEntries(
  winLossData.map((item, index) => [
    item.name,
    {
      name: item.name,
      color: `var(--vis-color${index})`,
    },
  ]),
);
</script>

<template>
  <div class="flex items-center gap-8">
    <div class="relative w-46 shrink-0">
      <DonutChart
        :data="winLossData.map((i) => i.value)"
        :categories="categories"
        :height="160"
        :arc-width="10"
        :pad-angle="2"
        :hide-legend="true"
      >
        <div class="text-2xl font-bold">
          {{ percentage }}<span class="text-toned">%</span>
        </div>
      </DonutChart>
    </div>

    <div class="flex h-40 flex-col justify-between">
      <div class="flex flex-col space-y-1">
        <div class="text-sm text-toned dark:text-muted">Winning trades</div>
        <div class="text-3xl font-bold">
          {{ winLossData[0]?.value ?? 0 }}
        </div>
      </div>
      <div class="flex flex-col space-y-1">
        <div class="text-sm text-toned dark:text-muted">Losing trades</div>
        <div class="text-3xl font-bold">
          {{ winLossData[1]?.value ?? 0 }}
        </div>
      </div>
    </div>
  </div>
</template>
