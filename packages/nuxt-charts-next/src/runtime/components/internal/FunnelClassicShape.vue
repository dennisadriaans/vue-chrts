<script setup lang="ts">
import { formatNumber } from "../../utils/format";
import { computed } from "vue";

type ClassicShapePayload = {
  name: string;
  value: number;
  color: string;
  maxValue: number;
  formattedValue?: string;
  showValue?: boolean;
  showStageLabel?: boolean;
  stageGap?: number;
  labelSizes?: {
    base?: number;
    value?: number;
    name?: number;
  };
};

const props = defineProps<{
  x?: number;
  y?: number;
  upperWidth?: number;
  lowerWidth?: number;
  height?: number;
  payload?: ClassicShapePayload;
}>();

const emit = defineEmits<{
  mouseenter: [event: MouseEvent, payload: ClassicShapePayload];
  mousemove: [event: MouseEvent];
  mouseleave: [];
}>();

const geometry = computed(() => {
  if (!props.payload) return null;

  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const upperWidth = props.upperWidth ?? 0;
  const lowerWidth = props.lowerWidth ?? 0;
  const height = props.height ?? 0;
  const centerX = x + upperWidth / 2;
  const gap = Math.min(props.payload.stageGap ?? 4, height * 0.2);
  const inset = Math.min(3, Math.max(0, lowerWidth / 4));
  const bottomLeft = centerX - lowerWidth / 2 + inset;
  const bottomRight = centerX + lowerWidth / 2 - inset;
  const bottomY = y + height - gap;
  const path = [
    `M ${x + 3} ${y + gap}`,
    `L ${x + upperWidth - 3} ${y + gap}`,
    `L ${bottomRight} ${bottomY}`,
    `L ${bottomLeft} ${bottomY}`,
    "Z",
  ].join(" ");

  const baseSize = props.payload.labelSizes?.base ?? Math.min(13, Math.max(10, height * 0.16));
  const valueSize = props.payload.labelSizes?.value ?? Math.round(baseSize * 1.12);
  const nameSize = props.payload.labelSizes?.name ?? Math.round(baseSize * 0.92);
  const narrowestWidth = Math.max(0, Math.min(upperWidth, lowerWidth || upperWidth * 0.45));

  return {
    centerX,
    centerY: y + height / 2,
    nameSize,
    path,
    showName:
      props.payload.showStageLabel !== false
      && narrowestWidth > props.payload.name.length * nameSize * 0.52 + 12,
    showValue: props.payload.showValue !== false && narrowestWidth > 42,
    valueSize,
  };
});

function handleMouseenter(event: MouseEvent) {
  if (props.payload) emit("mouseenter", event, props.payload);
}
</script>

<script lang="ts">
export default { name: "FunnelClassicShape", inheritAttrs: false };
</script>

<template>
  <g
    v-if="payload && geometry"
    class="vc-funnel-classic-shape"
    @mouseenter="handleMouseenter"
    @mousemove="emit('mousemove', $event)"
    @mouseleave="emit('mouseleave')"
  >
    <path
      class="vc-funnel-classic-shape__shadow"
      :d="geometry.path"
      :fill="payload.color"
      transform="translate(0 2)"
    />
    <path class="vc-funnel-classic-shape__body" :d="geometry.path" :fill="payload.color" />
    <path class="vc-funnel-classic-shape__highlight" :d="geometry.path" />

    <text
      v-if="geometry.showValue"
      class="vc-funnel-classic-shape__value"
      :x="geometry.centerX"
      :y="geometry.centerY - (geometry.showName ? 2 : 0)"
      :font-size="geometry.valueSize"
      font-weight="var(--vc-funnel-value-weight)"
      stroke="none"
      text-anchor="middle"
    >
      {{ payload.formattedValue ?? formatNumber(payload.value) }}
    </text>
    <text
      v-if="geometry.showName"
      class="vc-funnel-classic-shape__name"
      :x="geometry.centerX"
      :y="geometry.centerY + geometry.nameSize * 1.15"
      :font-size="geometry.nameSize"
      font-weight="var(--vc-funnel-label-weight)"
      stroke="none"
      text-anchor="middle"
    >
      {{ payload.name }}
    </text>
  </g>
</template>
