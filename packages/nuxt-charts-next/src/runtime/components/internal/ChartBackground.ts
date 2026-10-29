import { defineComponent, h, type PropType } from "vue";
import { usePlotArea } from "vccs";
import { BACKGROUND_PATTERNS, type BackgroundVariant } from "../../utils/background";
import { scopeId } from "../../utils/variants";

/**
 * A decorative texture painted behind the plot area.
 *
 * Rendered as the chart container's first child so the grid, series and axes
 * all draw over it — `vccs` has no z-index layer, so document order *is* the
 * stacking order here.
 *
 * The texture fills the plot area only, so it never runs under the axis ticks
 * or legend. Tiles are anchored to the plot's top-left corner, keeping a dot
 * grid aligned with the axes instead of starting mid-tile.
 *
 * With `fade`, the texture is also masked by a heavily blurred inset rect, so
 * it dissolves toward the edges and reads as a soft wash behind the data.
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
    fade: { type: Boolean, default: true },
  },
  setup: (props) => {
    const plotArea = usePlotArea();

    return () => {
      const pattern = BACKGROUND_PATTERNS[props.variant];
      if (!pattern) return null;

      // No plot area before the first layout pass; cover the whole chart until it resolves.
      const area = plotArea.value ?? { x: 0, y: 0, width: "100%", height: "100%" };

      const patternId = scopeId(`bg-${props.variant}`, props.scope);
      const maskId = scopeId("bg-fade", props.scope);
      const blurId = scopeId("bg-blur", props.scope);

      const tile = h(
        "pattern",
        {
          id: patternId,
          x: area.x,
          y: area.y,
          width: pattern.width,
          height: pattern.height,
          patternUnits: "userSpaceOnUse",
          ...(pattern.transform ? { patternTransform: pattern.transform } : {}),
        },
        pattern.shapes.map((shape, index) => h(shape.tag, { key: index, ...shape.attrs })),
      );

      const fadeDefs = [
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

      const defs = h("defs", {}, props.fade ? [tile, ...fadeDefs] : [tile]);

      return h("g", { class: "vc-chart-background", style: { color: "var(--vc-bg-pattern-color)" } }, [
        defs,
        h("rect", {
          x: area.x,
          y: area.y,
          width: area.width,
          height: area.height,
          fill: `url(#${patternId})`,
          ...(props.fade ? { mask: `url(#${maskId})` } : {}),
        }),
      ]);
    };
  },
});
