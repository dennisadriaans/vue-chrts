<script setup lang="ts">
import { formatNumber } from "../../utils/format";
import type { TooltipRoundness, TooltipVariant } from "../../utils/variants";
import { injectChartUi } from "../../composables/useChartUi";

defineProps<{
  datum: { name: string; value: number; color: string; formattedValue?: string };
  x: number;
  y: number;
  variant?: TooltipVariant;
  roundness?: TooltipRoundness;
}>();

const ui = injectChartUi();
</script>

<template>
  <div
    data-slot="tooltip"
    class="vc-funnel-layered__tooltip"
    :class="[
      variant === 'frosted-glass' && 'vc-tooltip--frosted-glass',
      roundness && `vc-tooltip--${roundness}`,
      ui.slot('tooltip', ui.slot('tooltipInline')),
    ]"
    :style="[ui.themeStyle.tooltip, { left: `${x}px`, top: `${y}px` }]"
  >
    <span data-slot="tooltipIndicator" class="vc-funnel-layered__dot" :class="ui.slot('tooltipIndicator')" :style="{ background: datum.color }" />
    <span data-slot="tooltipLabel" class="vc-funnel-layered__name" :class="ui.slot('tooltipLabel')">{{ datum.name }}</span>
    <strong data-slot="tooltipValue" class="vc-funnel-layered__value" :class="ui.slot('tooltipValue')">
      {{ datum.formattedValue ?? formatNumber(datum.value) }}
    </strong>
  </div>
</template>
