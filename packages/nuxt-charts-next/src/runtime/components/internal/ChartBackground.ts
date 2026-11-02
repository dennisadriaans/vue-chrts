import { defineComponent, h, type PropType, type VNode } from "vue";
import { useChartHeight, useChartWidth, usePlotArea } from "vccs";
import { BACKGROUND_PATTERNS, type BackgroundArea, type BackgroundVariant } from "../../utils/background";
import { scopeId } from "../../utils/variants";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A decorative texture painted behind the chart.
 *
 * Rendered as the chart container's first child so the grid, series and axes
 * all draw over it — `vccs` has no z-index layer, so document order *is* the
 * stacking order here.
 *
 * The texture fills the whole chart canvas, or with `area: "plot"` only the
 * box inside the axes. Tiles are anchored to the plot's top-left corner either
 * way, keeping a dot grid aligned with the axes instead of starting mid-tile.
 *
 * `fade: true` masks the texture with a heavily blurred inset rect, so it reads
 * as a soft wash in the middle of the chart. A number fades only the outer
 * band of that many pixels, keeping the texture crisp everywhere else.
 *
 * Every shape paints `currentColor`, and the group's `color` comes from a CSS
 * token — so the texture follows light / dark mode with no code here knowing
 * about themes.
 *
 * Render-function component for the same namespacing reason as `GradientDefs`:
 * SVG written in an SFC `<template>` outside a lexical `<svg>` is parsed as
 * HTML and silently dropped.
 */
export default defineComponent({
  name: "ChartBackground",
  props: {
    variant: { type: String as PropType<BackgroundVariant>, required: true },
    scope: { type: String, required: true },
    fade: { type: [Boolean, Number], default: true },
    area: { type: String as PropType<BackgroundArea>, default: "chart" },
  },
  setup: (props) => {
    const plotArea = usePlotArea();
    const chartWidth = useChartWidth();
    const chartHeight = useChartHeight();

    /** The softly centred wash: a blurred rect covering the middle of the canvas. */
    function washMask(maskId: string, blurId: string): VNode[] {
      return [
        h("filter", { id: blurId }, [h("feGaussianBlur", { stdDeviation: 25 })]),
        h("mask", { id: maskId, maskUnits: "userSpaceOnUse" }, [
          h("rect", {
            x: "8%",
            y: "20%",
            width: "85%",
            height: "60%",
            fill: "white",
            filter: `url(#${blurId})`,
          }),
        ]),
      ];
    }

    /**
     * Fades the outer `size` px of `bounds`: a rect inset by half the band, blurred
     * across it. The filter region is pinned to the bounds because the default
     * (bbox + 10%) clips the blur on wide charts and leaves a hard edge.
     */
    function edgeMask(maskId: string, blurId: string, bounds: Bounds, size: number): VNode[] {
      const inset = size / 2;
      return [
        h(
          "filter",
          { id: blurId, filterUnits: "userSpaceOnUse", ...bounds },
          [h("feGaussianBlur", { stdDeviation: size / 4 })],
        ),
        h("mask", { id: maskId, maskUnits: "userSpaceOnUse" }, [
          h("rect", {
            x: bounds.x + inset,
            y: bounds.y + inset,
            width: Math.max(0, bounds.width - size),
            height: Math.max(0, bounds.height - size),
            fill: "white",
            filter: `url(#${blurId})`,
          }),
        ]),
      ];
    }

    return () => {
      const pattern = BACKGROUND_PATTERNS[props.variant];
      if (!pattern) return null;

      const canvas = { x: 0, y: 0, width: chartWidth.value ?? 0, height: chartHeight.value ?? 0 };
      // No plot area before the first layout pass; fall back to the canvas until it resolves.
      const plot = plotArea.value ?? canvas;
      const bounds = props.area === "plot" ? plot : canvas;

      const patternId = scopeId(`bg-${props.variant}`, props.scope);
      const maskId = scopeId("bg-fade", props.scope);
      const blurId = scopeId("bg-blur", props.scope);

      const tile = h(
        "pattern",
        {
          id: patternId,
          x: plot.x,
          y: plot.y,
          width: pattern.width,
          height: pattern.height,
          patternUnits: "userSpaceOnUse",
          ...(pattern.transform ? { patternTransform: pattern.transform } : {}),
        },
        pattern.shapes.map((shape, index) => h(shape.tag, { key: index, ...shape.attrs })),
      );

      const fadeSize = typeof props.fade === "number" && props.fade > 0 ? props.fade : 0;
      const mask = fadeSize
        ? edgeMask(maskId, blurId, bounds, fadeSize)
        : props.fade === true
          ? washMask(maskId, blurId)
          : [];

      return h("g", { class: "vc-chart-background", style: { color: "var(--vc-bg-pattern-color)" } }, [
        h("defs", {}, [tile, ...mask]),
        h("rect", {
          ...bounds,
          fill: `url(#${patternId})`,
          ...(mask.length ? { mask: `url(#${maskId})` } : {}),
        }),
      ]);
    };
  },
});
