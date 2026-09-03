import { defineComponent, h, type PropType, type VNode } from "vue";
import { variantId } from "../../utils/variants";

type SegmentItem = { dataKey: string; color: string };

/**
 * Emits the `<defs>` paints a pie / donut segment variant references.
 *
 * The gradient runs corner-to-corner rather than top-to-bottom, so a ring of
 * segments reads as lit from one direction instead of each segment repeating
 * the same vertical ramp.
 *
 * With one colour per segment the ramp is built by fading that colour toward
 * transparent, which is what gives a flat palette a sense of depth without
 * asking the caller for a second colour.
 *
 * Render-function component for the same namespacing reason as `GradientDefs`:
 * SVG written in an SFC `<template>` outside a lexical `<svg>` is parsed as
 * HTML and silently dropped.
 */
export default defineComponent({
  name: "SegmentVariantDefs",
  props: {
    segments: { type: Array as PropType<SegmentItem[]>, required: true },
    scope: { type: String, required: true },
    /** Emit the diagonal colour ramp each segment can paint from. */
    gradient: { type: Boolean, default: false },
    /** Emit the outer-glow filter each segment can reference. */
    glow: { type: Boolean, default: false },
  },
  setup: (props) => () => {
    const children: VNode[] = [];

    for (const segment of props.segments) {
      if (props.gradient) children.push(gradient(segment, props.scope));
      if (props.glow) children.push(glowFilter(segment.dataKey, props.scope));
    }

    return h("defs", {}, children);
  },
});

/** Id of the ramp a segment references for the `gradient` variant. */
export function segmentGradientId(dataKey: string, scope: string): string {
  return variantId("segment-gradient", dataKey, scope);
}

/** Diagonal ramp: the segment's colour at full strength, fading across the sector. */
function gradient(segment: SegmentItem, scope: string): VNode {
  const id = segmentGradientId(segment.dataKey, scope);

  return h("linearGradient", { id, key: id, x1: 0, y1: 0, x2: 1, y2: 1 }, [
    h("stop", { offset: "0%", "stop-color": segment.color, "stop-opacity": 1 }),
    h("stop", { offset: "100%", "stop-color": segment.color, "stop-opacity": 0.45 }),
  ]);
}

/**
 * Soft outer glow. The colour matrix keeps the blurred copy's hue and drops it
 * to half alpha, so the glow tints with the segment instead of washing it grey.
 */
function glowFilter(dataKey: string, scope: string): VNode {
  const id = variantId("glow", dataKey, scope);

  return h(
    "filter",
    { id, key: id, x: "-100%", y: "-100%", width: "300%", height: "300%" },
    [
      h("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 6, result: "blur" }),
      h("feColorMatrix", {
        in: "blur",
        type: "matrix",
        values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0",
        result: "glow",
      }),
      h("feMerge", {}, [
        h("feMergeNode", { in: "glow" }),
        h("feMergeNode", { in: "SourceGraphic" }),
      ]),
    ],
  );
}
