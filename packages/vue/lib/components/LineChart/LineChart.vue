<script setup lang="ts" generic="T">
import AreaChart from "../AreaChart/AreaChart.vue";
import type { LineChartProps } from "./types";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<LineChartProps<T>>();
</script>

<template>
  <AreaChart v-bind="props" :hide-area="true">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </AreaChart>
</template>