import { defineComponent, h, type PropType, type VNode } from "vue";
import { variantId, type AreaFillVariant } from "../../utils/variants";

type SeriesItem = { dataKey: string; color: string };

/**
 * Emits the `<defs>` paints an area fill variant references.
 *
 * Built the same way as the bar variants: a greyscale texture becomes a
 * `<mask>`, the mask is applied to a rect painted in the series colour, and
 * that rect lives in a plot-sized `<pattern>` the area's `fill` points at.
 *
 * The textures are deliberately faint (0.1–0.5 alpha). An area fill sits under
 * its own stroke and often overlaps a neighbouring series, so a full-strength
 * texture would fight the line it is supposed to support.
 *
 * Render-function component for the same namespacing reason as `GradientDefs`:
 * SVG written in an SFC `<template>` outside a lexical `<svg>` is parsed as
 * HTML and dropped, so `fill="url(#…)"` would never resolve.
 */
export default defineComponent({
  name: "AreaVariantDefs",
  props: {
    series: { type: Array as PropType<SeriesItem[]>, required: true },
    /** Omit to emit no fill paints — useful when only the glow filter is wanted. */
    variant: { type: String as PropType<AreaFillVariant>, default: undefined },
    scope: { type: String, required: true },
    /** Also emit the outer-glow filter each series can reference. */
    glow: { type: Boolean, default: false },
  },
  setup: (props) => () => {
    const children: VNode[] = [];

    for (const series of props.series) {
      if (props.variant) children.push(...paintsFor(props.variant, series, props.scope));
      if (props.glow) children.push(glowFilter(series.dataKey, props.scope));
    }

    return h("defs", {}, children);
  },
});

/** Wraps a texture-as-mask around a series-coloured rect, the shared shape of every variant. */
function maskedFill(
  kind: string,
  series: SeriesItem,
  scope: string,
  texture: VNode,
  textureId: string,
  textureOpacity?: number,
): VNode[] {
  const maskId = variantId(`area-${kind}-mask`, series.dataKey, scope);

  return [
    texture,
    h("mask", { id: maskId, key: maskId }, [
      h("rect", {
        width: "100%",
        height: "100%",
        fill: `url(#${textureId})`,
        ...(textureOpacity === undefined ? {} : { "fill-opacity": textureOpacity }),
      }),
    ]),
    h(
      "pattern",
      {
        id: areaFillId(kind, series.dataKey, scope),
        key: areaFillId(kind, series.dataKey, scope),
        patternUnits: "userSpaceOnUse",
        width: "100%",
        height: "100%",
      },
      [
        h("rect", {
          width: "100%",
          height: "100%",
          fill: series.color,
          mask: `url(#${maskId})`,
        }),
      ],
    ),
  ];
}

/** Id of the paint an area references for one fill variant. */
export function areaFillId(variant: string, dataKey: string, scope: string): string {
  return variantId(`area-${variant}`, dataKey, scope);
}

/** The paints one variant needs for one series. */
function paintsFor(variant: AreaFillVariant, series: SeriesItem, scope: string): VNode[] {
  switch (variant) {
    case "gradient-reverse":
      return verticalFadePaints(series, scope, "gradient-reverse", 0, 0.1);
    case "solid":
      return verticalFadePaints(series, scope, "solid", 0.1, 0.1);
    case "dotted":
      return dottedPaints(series, scope);
    case "lines":
      return linesPaints(series, scope);
    case "hatched":
      return hatchedPaints(series, scope);
    default:
      return verticalFadePaints(series, scope, "gradient", 0.1, 0);
  }
}

/**
 * A vertical opacity ramp. Covers three variants at once, since `gradient`,
 * `gradient-reverse` and `solid` differ only in their two stop opacities.
 */
function verticalFadePaints(
  series: SeriesItem,
  scope: string,
  kind: string,
  top: number,
  bottom: number,
): VNode[] {
  const textureId = variantId(`area-${kind}-fade`, series.dataKey, scope);
  const texture = h(
    "linearGradient",
    { id: textureId, key: textureId, x1: 0, y1: 0, x2: 0, y2: 1 },
    [
      h("stop", { offset: "0%", "stop-color": "white", "stop-opacity": top }),
      h("stop", { offset: "100%", "stop-color": "white", "stop-opacity": bottom }),
    ],
  );

  return maskedFill(kind, series, scope, texture, textureId);
}

/** A fine dot grid — the lightest of the textures, closest to a plain tint. */
function dottedPaints(series: SeriesItem, scope: string): VNode[] {
  const textureId = variantId("area-dotted-texture", series.dataKey, scope);
  const texture = h(
    "pattern",
    {
      id: textureId,
      key: textureId,
      x: 0,
      y: 0,
      width: 6,
      height: 6,
      patternUnits: "userSpaceOnUse",
    },
    [h("circle", { cx: 4, cy: 4, r: 0.5, fill: "white" })],
  );

  return maskedFill("dotted", series, scope, texture, textureId, 0.5);
}

/** Diagonal hairlines at 45°. */
function linesPaints(series: SeriesItem, scope: string): VNode[] {
  const textureId = variantId("area-lines-texture", series.dataKey, scope);
  const texture = h(
    "pattern",
    {
      id: textureId,
      key: textureId,
      patternUnits: "userSpaceOnUse",
      width: 5,
      height: 5,
      patternTransform: "rotate(45)",
    },
    [h("line", { x1: 0, y1: 0, x2: 0, y2: 5, stroke: "white", "stroke-width": 1 })],
  );

  return maskedFill("lines", series, scope, texture, textureId, 0.3);
}

/**
 * Broad diagonal bands. Each band carries its own left-to-right ramp, so the
 * stripes have soft edges rather than the hard cut of the bar hatch.
 */
function hatchedPaints(series: SeriesItem, scope: string): VNode[] {
  const stripeId = variantId("area-hatched-stripe", series.dataKey, scope);
  const textureId = variantId("area-hatched-texture", series.dataKey, scope);

  const stripe = h(
    "linearGradient",
    { id: stripeId, key: stripeId, x1: 0, y1: 0, x2: 1, y2: 0 },
    [
      h("stop", { offset: "50%", "stop-color": "white", "stop-opacity": 0.2 }),
      h("stop", { offset: "50%", "stop-color": "white", "stop-opacity": 1 }),
    ],
  );

  const texture = h(
    "pattern",
    {
      id: textureId,
      key: textureId,
      x: 0,
      y: 0,
      width: 20,
      height: 10,
      patternUnits: "userSpaceOnUse",
      overflow: "visible",
      patternTransform: "rotate(20)",
    },
    [h("rect", { width: 20, height: 10, fill: `url(#${stripeId})` })],
  );

  return [stripe, ...maskedFill("hatched", series, scope, texture, textureId, 0.2)];
}

/**
 * Soft outer glow. The colour matrix keeps the blurred copy's hue and drops it
 * to half alpha, so the glow tints with the series instead of washing it grey.
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
