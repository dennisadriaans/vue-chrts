<script setup lang="ts">
/**
 * One curved, nested funnel stage for the {@link FunnelChart} `layered` variant.
 * Rendered through the `vccs` `<Funnel>` `#shape` slot. Draws three stacked
 * paths (depth), a divider, the stage value, a percentage badge and the stage
 * name. Colours resolve from the datum; text/chrome use the library's shadcn
 * theme tokens with sensible fallbacks.
 */
import { computed } from "vue";

export type FunnelLayeredDatum = { name: string; value: number; color: string };

type LayeredShapePayload = FunnelLayeredDatum & {
  stageIndex: number;
  stageCount: number;
  maxValue: number;
  nextValue: number;
};

type ViewBox = { x?: number; y?: number; width?: number; height?: number };

const props = defineProps<{
  payload?: LayeredShapePayload;
  parentViewBox?: ViewBox;
}>();

const emit = defineEmits<{
  mouseenter: [event: MouseEvent, payload: FunnelLayeredDatum];
  mousemove: [event: MouseEvent];
  mouseleave: [];
}>();

const geometry = computed(() => {
  if (!props.payload) return null;

  const { x = 0, y = 0, width = 0, height = 0 } = props.parentViewBox ?? {};
  const segmentWidth = width / props.payload.stageCount;
  const startX = x + segmentWidth * props.payload.stageIndex;
  const endX = startX + segmentWidth;
  const centerY = y + height * 0.54;
  const maxHalfHeight = height * 0.31;
  const startRatio =
    props.payload.maxValue > 0 ? props.payload.value / props.payload.maxValue : 0;
  const endRatio =
    props.payload.stageIndex === props.payload.stageCount - 1
      ? startRatio
      : Math.max(0, props.payload.nextValue / props.payload.maxValue);
  const percentage = Math.round(startRatio * 100);

  const path = (scale: number) => {
    const startHalfHeight = maxHalfHeight * startRatio * scale;
    const endHalfHeight = maxHalfHeight * endRatio * scale;
    const controlOffset = segmentWidth * 0.55;

    return [
      `M ${startX} ${centerY - startHalfHeight}`,
      `C ${startX + controlOffset} ${centerY - startHalfHeight}`,
      `${endX - controlOffset} ${centerY - endHalfHeight}`,
      `${endX} ${centerY - endHalfHeight}`,
      `L ${endX} ${centerY + endHalfHeight}`,
      `C ${endX - controlOffset} ${centerY + endHalfHeight}`,
      `${startX + controlOffset} ${centerY + startHalfHeight}`,
      `${startX} ${centerY + startHalfHeight}`,
      "Z",
    ].join(" ");
  };

  return {
    badgeWidth: percentage === 100 ? 70 : 58,
    bottomLabelY: y + height - 16,
    centerY,
    dividerStartY: centerY - maxHalfHeight * startRatio * 1.14,
    dividerEndY: centerY + maxHalfHeight * startRatio * 1.14,
    middleX: startX + segmentWidth / 2,
    path,
    percentage,
    startX,
    topLabelY: y + 30,
  };
});

function handleMouseenter(event: MouseEvent) {
  if (props.payload) emit("mouseenter", event, props.payload);
}
</script>

<script lang="ts">
export default { name: "FunnelLayeredShape" };
</script>

<template>
  <g
    v-if="payload && geometry"
    class="vc-funnel-layered-shape"
    @mouseenter="handleMouseenter"
    @mousemove="emit('mousemove', $event)"
    @mouseleave="emit('mouseleave')"
  >
    <path :d="geometry.path(1.14)" :fill="payload.color" opacity="0.22" />
    <path :d="geometry.path(1.07)" :fill="payload.color" opacity="0.5" />
    <path :d="geometry.path(1)" :fill="payload.color" opacity="0.9" />

    <line
      v-if="payload.stageIndex > 0"
      :x1="geometry.startX"
      :x2="geometry.startX"
      :y1="geometry.dividerStartY"
      :y2="geometry.dividerEndY"
      stroke="var(--vc-surface-bg)"
      :stroke-width="5"
    />

    <text
      :x="geometry.middleX"
      :y="geometry.topLabelY"
      fill="var(--vc-axis-label-color)"
      :font-size="16"
      :font-weight="700"
      text-anchor="middle"
    >
      {{ payload.value.toLocaleString() }}
    </text>

    <rect
      :x="geometry.middleX - geometry.badgeWidth / 2"
      :y="geometry.centerY - 15"
      :width="geometry.badgeWidth"
      :height="30"
      :rx="15"
      fill="var(--vc-surface-bg)"
      fill-opacity="0.82"
      stroke="var(--vc-axis-line-color)"
      stroke-opacity="0.7"
      :stroke-width="1"
    />
    <text
      :x="geometry.middleX"
      :y="geometry.centerY + 5"
      fill="var(--vc-axis-label-color)"
      :font-size="14"
      :font-weight="600"
      text-anchor="middle"
    >
      {{ geometry.percentage }}%
    </text>

    <text
      :x="geometry.middleX"
      :y="geometry.bottomLabelY"
      fill="var(--vc-tick-color)"
      :font-size="15"
      :font-weight="500"
      text-anchor="middle"
    >
      {{ payload.name }}
    </text>
  </g>
</template>
