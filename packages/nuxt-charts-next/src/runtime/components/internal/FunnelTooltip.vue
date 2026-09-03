<script setup lang="ts">
import type { TooltipRoundness, TooltipVariant } from "../../utils/variants";

defineProps<{
  datum: { name: string; value: number; color: string; formattedValue?: string };
  x: number;
  y: number;
  variant?: TooltipVariant;
  roundness?: TooltipRoundness;
}>();
</script>

<template>
  <div
    class="vc-funnel-layered__tooltip"
    :class="[
      variant === 'frosted-glass' && 'vc-tooltip--frosted-glass',
      roundness && `vc-tooltip--${roundness}`,
    ]"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <span class="vc-funnel-layered__dot" :style="{ background: datum.color }" />
    <span class="vc-funnel-layered__name">{{ datum.name }}</span>
    <strong class="vc-funnel-layered__value">
      {{ datum.formattedValue ?? datum.value.toLocaleString() }}
    </strong>
  </div>
</template>
