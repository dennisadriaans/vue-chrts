<script setup lang="ts">
import { formatNumber } from "../../utils/format";
/**
 * One curved, nested funnel stage for the {@link FunnelChart} `layered` variant.
 * Rendered through the `vccs` `#shape` slot. Draws three stacked paths (depth),
 * a divider, the stage value, a percentage badge and the stage name.
 *
 * Label typography auto-fits the plot: sizes derive from the stage's own
 * segment width and the plot height, so a 220px card and a 600px dashboard tile
 * both read correctly. `labelSize` on the datum pins the base size instead.
 * Colour resolves from CSS tokens (`--vc-funnel-*`) via `fill`. Weight is the
 * same tokens, applied as SVG `font-weight` so a host override actually paints.
 * vccs Funnel's default `stroke="#fff"` must not reach this `<g>` — SVG stroke
 * inherits onto `<text>` and paints a glyph outline that reads as extra-bold.
 */
import { computed } from "vue";

export type FunnelLayeredDatum = {
  name: string;
  value: number;
  color: string;
  formattedValue?: string;
};

type LayeredShapePayload = FunnelLayeredDatum & {
  stageIndex: number;
  stageCount: number;
  maxValue: number;
  nextValue: number;
  /** Resolved label sizes in px. Any field omitted = auto-fit / derive from base. */
  labelSizes?: {
    base?: number;
    value?: number;
    percentage?: number;
    name?: number;
  };
  showValue?: boolean;
  showPercentage?: boolean;
  showStageLabel?: boolean;
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

const MIN_LABEL_SIZE = 9;
const MAX_LABEL_SIZE = 14;
/** Rough advance width per character, as a fraction of font size, for the UI stack. */
const CHAR_WIDTH_RATIO = 0.6;

const clamp = (min: number, value: number, max: number) =>
  Math.min(Math.max(value, min), max);

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

  // Auto-fit: whichever of the two axes is tighter decides the base size.
  const sizes = props.payload.labelSizes;
  const base =
    sizes?.base
    ?? clamp(
      MIN_LABEL_SIZE,
      Math.min(height * 0.058, segmentWidth * 0.135),
      MAX_LABEL_SIZE,
    );
  const valueSize = sizes?.value ?? Math.round(base * 1.08);
  const badgeSize = sizes?.percentage ?? Math.round(base * 0.9);
  const nameSize = sizes?.name ?? Math.round(base);

  const badgeLabel = `${percentage}%`;
  const badgePaddingX = Math.round(badgeSize * 0.7);
  const badgeHeight = Math.round(badgeSize * 1.85);
  const badgeWidth = Math.min(
    Math.round(badgeLabel.length * badgeSize * CHAR_WIDTH_RATIO + badgePaddingX * 2),
    Math.max(24, segmentWidth - 8),
  );

  // Drop the badge rather than let it collide with the stage dividers.
  const showBadge =
    props.payload.showPercentage !== false && segmentWidth > badgeWidth + 6;

  const maxNameChars = Math.floor((segmentWidth - 6) / (nameSize * CHAR_WIDTH_RATIO));
  const name =
    props.payload.name.length > maxNameChars && maxNameChars > 1
      ? `${props.payload.name.slice(0, maxNameChars - 1)}…`
      : props.payload.name;

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
    badgeHeight,
    badgeLabel,
    badgeSize,
    badgeWidth,
    badgeY: centerY - badgeHeight / 2,
    badgeTextY: centerY + badgeSize * 0.35,
    bottomLabelY: y + height - Math.round(nameSize * 0.3),
    dividerStartY: centerY - maxHalfHeight * startRatio * 1.14,
    dividerEndY: centerY + maxHalfHeight * startRatio * 1.14,
    middleX: startX + segmentWidth / 2,
    name,
    nameSize,
    path,
    showBadge,
    startX,
    topLabelY: y + Math.round(valueSize * 1.9),
    valueSize,
  };
});

function handleMouseenter(event: MouseEvent) {
  if (props.payload) emit("mouseenter", event, props.payload);
}
</script>

<script lang="ts">
export default { name: "FunnelLayeredShape", inheritAttrs: false };
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
      class="vc-funnel-layered-shape__divider"
      :x1="geometry.startX"
      :x2="geometry.startX"
      :y1="geometry.dividerStartY"
      :y2="geometry.dividerEndY"
      :stroke-width="5"
    />

    <text
      v-if="payload.showValue !== false"
      class="vc-funnel-layered-shape__value"
      :x="geometry.middleX"
      :y="geometry.topLabelY"
      :font-size="geometry.valueSize"
      font-weight="var(--vc-funnel-value-weight)"
      stroke="none"
      text-anchor="middle"
    >
      {{ payload.formattedValue ?? formatNumber(payload.value) }}
    </text>

    <template v-if="geometry.showBadge">
      <rect
        class="vc-funnel-layered-shape__badge"
        :x="geometry.middleX - geometry.badgeWidth / 2"
        :y="geometry.badgeY"
        :width="geometry.badgeWidth"
        :height="geometry.badgeHeight"
        :rx="geometry.badgeHeight / 2"
        :stroke-width="1"
      />
      <text
        class="vc-funnel-layered-shape__badge-text"
        :x="geometry.middleX"
        :y="geometry.badgeTextY"
        :font-size="geometry.badgeSize"
        font-weight="var(--vc-funnel-badge-weight)"
        stroke="none"
        text-anchor="middle"
      >
        {{ geometry.badgeLabel }}
      </text>
    </template>

    <text
      v-if="payload.showStageLabel !== false"
      class="vc-funnel-layered-shape__name"
      :x="geometry.middleX"
      :y="geometry.bottomLabelY"
      :font-size="geometry.nameSize"
      font-weight="var(--vc-funnel-label-weight)"
      stroke="none"
      text-anchor="middle"
    >
      {{ geometry.name }}
    </text>
  </g>
</template>
