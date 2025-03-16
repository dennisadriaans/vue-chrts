<script setup lang="ts">
import { Donut } from "@unovis/ts";
import {
  VisBulletLegend,
  VisDonut,
  VisSingleContainer,
  VisTooltip,
} from "@unovis/vue";

export type DonutChartProps = {
    type?: string;
    data: number[];
    height: number;
    radius: number;
    hidePagination?: boolean
    labels: {
      name: string;
      color: string;
    }[];
  }

const props = defineProps<DonutChartProps>();

const value = (d: number) => d;

const isHalf = props.type === "half";

const tooltip = {
  [Donut.selectors.segment]: (d: any) => {
    console.log();

    return `<div class='flex items-center'><div class='w-2 h-2 rounded-full mr-2' style='background-color: ${
      props.labels[d.index].color
    } ;'></div>
        <div>${d.data}</div>
      </vistooltip>
    </vissinglecontainer>
  </div>`;
  },
};
</script>

<template>
  <div class="flex items-center justify-center">
    <VisSingleContainer
      :class="isHalf ? 'mt-24' : ''"
      :data="data"
      :height="height"
      :margin="{}"
    >
      <VisTooltip
        :horizontal-shift="20"
        :vertical-shift="20"
        :triggers="tooltip"
      />

      <VisDonut
        :value="value"
        :corner-radius="radius"
        :color="props.labels.map((l) => l.color)"
        :angle-range="isHalf ? [-1.5707963267948966, 1.5707963267948966] : []"
      />
    </VisSingleContainer>

    <slot />
  </div>

  <div v-if="!hidePagination" class="flex items-center justify-center mt-4">
    <VisBulletLegend :items="labels" />
  </div>
</template>
