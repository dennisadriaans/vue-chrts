<script setup lang="ts" generic="T">
import { AreaChart } from "vue-chrts";
import type { AreaChartProps } from "vue-chrts/types";
const props = defineProps<AreaChartProps<T>>();
</script>
<template>
  <div>
    <AreaChart v-bind="props" />
  </div>
</template>
