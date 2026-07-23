<script setup lang="ts">
import { computed } from "vue";
import type { TooltipContentProps } from "vccs";

defineOptions({ name: "ChartTooltip", inheritAttrs: false });

const props = defineProps<TooltipContentProps>();

const items = computed(() =>
  (props.payload ?? []).filter((p) => p.value !== null && p.value !== undefined),
);

function formatValue(value: unknown): string {
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
</script>

<template>
  <div
    v-if="active && items.length"
    class="vc-tooltip"
  >
    <p v-if="label !== undefined && label !== ''" class="vc-tooltip__label">
      {{ label }}
    </p>
    <ul class="vc-tooltip__list">
      <li v-for="item in items" :key="item.dataKey as string" class="vc-tooltip__item">
        <span
          class="vc-tooltip__dot"
          :style="{ background: item.color ?? item.fill ?? item.stroke }"
        />
        <span class="vc-tooltip__name">{{ item.name }}</span>
        <span class="vc-tooltip__value">{{ formatValue(item.value) }}</span>
      </li>
    </ul>
  </div>
</template>
