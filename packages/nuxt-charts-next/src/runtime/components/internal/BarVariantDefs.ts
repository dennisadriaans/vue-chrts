import { defineComponent, h, type PropType, type VNode } from "vue";
import { variantId, type BarVariant } from "../../utils/variants";

type SeriesItem = { dataKey: string; color: string };

/**
 * Emits the `<defs>` paints a patterned bar variant references.
 *
 * Each variant is built the same way: a greyscale texture becomes a `<mask>`,
 * the mask is applied to a rect painted in the series colour, and that rect
 * lives inside a `<pattern>` sized to the bar. The bar then just references
 * `fill="url(#…)"` — so the variant, the colour, and the bar geometry stay
 * independent of one another.
 *
 * Like `GradientDefs`, this is a render-function component on purpose: SVG
 * elements written in an SFC `<template>` that is not lexically nested inside
 * an `<svg>` tag are parsed in the HTML namespace and silently dropped when
 * placed via a component slot. Building them with `h()` sets the correct SVG
 * namespace so `fill="url(#…)"` resolves.
 */
export default defineComponent({
  name: "BarVariantDefs",
  props: {
    series: { type: Array as PropType<SeriesItem[]>, required: true },
    variant: { type: String as PropType<BarVariant>, required: true },
    scope: { type: String, required: true },
    /** Also emit the outer-glow filter each series can reference. */
    glow: { type: Boolean, default: false },
    /** Also emit the hollow hatch used to mark the final bar as a projection. */
    buffer: { type: Boolean, default: false },
  },
  setup: (props) => () => {
    const children: VNode[] = [];

    for (const series of props.series) {
      children.push(...paintsFor(props.variant, series, props.scope));
      if (props.buffer) children.push(...bufferPaints(series, props.scope));
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
): VNode[] {
  const maskId = variantId(`${kind}-mask`, series.dataKey, scope);

  return [
    texture,
    h("mask", { id: maskId, key: maskId }, [
      h("rect", { width: "100%", height: "100%", fill: `url(#${textureId})` }),
    ]),
    h(
      "pattern",
      {
        id: variantId(kind, series.dataKey, scope),
        key: variantId(kind, series.dataKey, scope),
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

/** The paints one variant needs for one series. Flat variants need none. */
function paintsFor(variant: BarVariant, series: SeriesItem, scope: string): VNode[] {
  switch (variant) {
    case "hatched":
      return hatchedPaints(series, scope);
    case "duotone":
      return duotonePaints(series, scope, false);
    case "duotone-reverse":
      return duotonePaints(series, scope, true);
    case "gradient":
      return gradientPaints(series, scope);
    case "stripped":
      return strippedPaints(series, scope);
    default:
      return [];
  }
}

/**
 * Diagonal stripes: opaque bands over a 30%-opacity ground, so the bar keeps a
 * readable body instead of dissolving into loose lines.
 */
function hatchedPaints(series: SeriesItem, scope: string): VNode[] {
  const textureId = variantId("hatched-texture", series.dataKey, scope);
  const texture = h(
    "pattern",
    {
      id: textureId,
      key: textureId,
      x: 0,
      y: 0,
      width: 5,
      height: 5,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(-45)",
    },
    [
      h("rect", { width: 5, height: 5, fill: "white", "fill-opacity": 0.3 }),
      h("rect", { width: 1.5, height: 5, fill: "white", "fill-opacity": 1 }),
    ],
  );

  return maskedFill("hatched", series, scope, texture, textureId);
}

/**
 * A vertical split down the middle of each bar: one half at full strength, the
 * other faded. `reverse` swaps which half is which.
 *
 * Sized in `objectBoundingBox` units so the split always lands at the bar's own
 * midpoint, whatever its width — a user-space pattern would tile across a wide
 * bar and produce stripes instead of two halves.
 */
function duotonePaints(series: SeriesItem, scope: string, reverse: boolean): VNode[] {
  const kind = reverse ? "duotone-reverse" : "duotone";
  const splitId = variantId(`${kind}-split`, series.dataKey, scope);
  const maskId = variantId(`${kind}-mask`, series.dataKey, scope);
  const patternId = variantId(kind, series.dataKey, scope);

  return [
    h(
      "linearGradient",
      {
        id: splitId,
        key: splitId,
        gradientUnits: "objectBoundingBox",
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0,
      },
      [
        h("stop", { offset: "50%", "stop-color": "white", "stop-opacity": reverse ? 1 : 0.4 }),
        h("stop", { offset: "50%", "stop-color": "white", "stop-opacity": reverse ? 0.4 : 1 }),
      ],
    ),
    h("mask", { id: maskId, key: maskId, maskContentUnits: "objectBoundingBox" }, [
      h("rect", { x: 0, y: 0, width: 1, height: 1, fill: `url(#${splitId})` }),
    ]),
    h(
      "pattern",
      {
        id: patternId,
        key: patternId,
        patternUnits: "objectBoundingBox",
        patternContentUnits: "objectBoundingBox",
        width: 1,
        height: 1,
      },
      [
        h("rect", {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          fill: series.color,
          mask: `url(#${maskId})`,
        }),
      ],
    ),
  ];
}

/** Series colour at the top of the plot, dissolving to nothing near the baseline. */
function gradientPaints(series: SeriesItem, scope: string): VNode[] {
  const textureId = variantId("gradient-fade", series.dataKey, scope);
  const texture = h(
    "linearGradient",
    { id: textureId, key: textureId, x1: 0, y1: 0, x2: 0, y2: 1 },
    [
      h("stop", { offset: "20%", "stop-color": "white", "stop-opacity": 1 }),
      h("stop", { offset: "90%", "stop-color": "white", "stop-opacity": 0 }),
    ],
  );

  return maskedFill("gradient", series, scope, texture, textureId);
}

/** A 20%-opacity body. `VariantBarShape` draws the solid cap that floats above it. */
function strippedPaints(series: SeriesItem, scope: string): VNode[] {
  const textureId = variantId("stripped-wash", series.dataKey, scope);
  const texture = h(
    "linearGradient",
    { id: textureId, key: textureId, x1: 0, y1: 0, x2: 0, y2: 1 },
    [
      h("stop", { offset: "0%", "stop-color": "white", "stop-opacity": 0.2 }),
      h("stop", { offset: "100%", "stop-color": "white", "stop-opacity": 0.2 }),
    ],
  );

  return maskedFill("stripped", series, scope, texture, textureId);
}

/**
 * Hollow diagonal hatch — lines only, no ground — used to mark the final bar as
 * a projection rather than a recorded value.
 */
function bufferPaints(series: SeriesItem, scope: string): VNode[] {
  const textureId = variantId("buffer-texture", series.dataKey, scope);
  const texture = h(
    "pattern",
    {
      id: textureId,
      key: textureId,
      x: 0,
      y: 0,
      width: 5,
      height: 5,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(-45)",
    },
    [
      h("rect", { width: 5, height: 5, fill: "black", "fill-opacity": 0 }),
      h("rect", { width: 1, height: 5, fill: "white", "fill-opacity": 1 }),
    ],
  );

  return maskedFill("buffer", series, scope, texture, textureId);
}

/**
 * Soft outer glow. The colour matrix keeps the blurred copy's hue and drops it
 * to half alpha, so the glow tints with the bar instead of washing it grey.
 */
function glowFilter(dataKey: string, scope: string): VNode {
  const id = variantId("glow", dataKey, scope);

  return h(
    "filter",
    { id, key: id, x: "-100%", y: "-100%", width: "300%", height: "300%" },
    [
      h("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 8, result: "blur" }),
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
