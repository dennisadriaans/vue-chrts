
<script setup lang="ts" generic="T">
import AreaChart from "../AreaChart/AreaChart.vue";
import type { LineChartProps } from "./LineChart";

const props = defineProps<LineChartProps<T>>();

const slots = defineSlots<{
  tooltip?: (props: { values: T | undefined }) => any;
}>();
</script>

<template>
  <AreaChart v-bind="props" :hide-area="true">
    <template v-if="$slots.tooltip" #tooltip="scope">
      <slot name="tooltip" v-bind="scope" />
    </template>
  </AreaChart>
</template>