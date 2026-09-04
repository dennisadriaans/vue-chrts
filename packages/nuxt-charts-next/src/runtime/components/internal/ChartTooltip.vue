<script setup lang="ts">
import { formatNumber } from "../../utils/format";
import { computed } from "vue";
import type { TooltipContentProps } from "vccs";
import type { TooltipRoundness, TooltipVariant } from "../../utils/variants";

defineOptions({ name: "ChartTooltip", inheritAttrs: false });

const props = defineProps<
  TooltipContentProps & {
    /** Surface treatment. `frosted-glass` blurs what sits behind the tooltip. */
    variant?: TooltipVariant;
    /** Corner radius preset. Falls back to the `--vc-tooltip-radius` token. */
    roundness?: TooltipRoundness;
  }
>();

const items = computed(() =>
  (props.payload ?? []).filter((p) => p.value !== null && p.value !== undefined),
);

function formatValue(value: unknown): string {
  if (typeof value === "number") return formatNumber(value);
  return String(value);
}
</script>

<template>
  <div
    v-if="active && items.length"
    class="vc-tooltip"
    :class="[
      variant === 'frosted-glass' && 'vc-tooltip--frosted-glass',
      roundness && `vc-tooltip--${roundness}`,
    ]"
  >
    <p v-if="label !== undefined && label !== ''" class="vc-tooltip__label">
      {{ label }}
    </p>
    <ul class="vc-tooltip__list">
      <li v-for="(item, index) in items" :key="index" class="vc-tooltip__item">
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
