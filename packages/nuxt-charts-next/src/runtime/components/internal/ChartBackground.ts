import { defineComponent, h, type PropType } from "vue";
import { BACKGROUND_PATTERNS, type BackgroundVariant } from "../../utils/background";
import { scopeId } from "../../utils/variants";

/**
 * A decorative texture painted behind the plot area.
 *
 * Rendered as the chart container's first child so the grid, series and axes
 * all draw over it — `vccs` has no z-index layer, so document order *is* the
 * stacking order here.
 *
 * The texture is masked by a heavily blurred inset rect, which fades it out
 * toward the chart's edges. Without that fade the pattern runs under the axis
 * ticks and legend and competes with them for attention; with it, the texture
 * reads as a soft wash behind the data and nothing else.
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
  },
  setup: (props) => () => {
    const pattern = BACKGROUND_PATTERNS[props.variant];
    if (!pattern) return null;

    const patternId = scopeId(`bg-${props.variant}`, props.scope);
    const maskId = scopeId("bg-fade", props.scope);
    const blurId = scopeId("bg-blur", props.scope);

    const tile = h(
      "pattern",
      {
        id: patternId,
        x: 0,
        y: 0,
        width: pattern.width,
        height: pattern.height,
        patternUnits: "userSpaceOnUse",
        ...(pattern.transform ? { patternTransform: pattern.transform } : {}),
      },
      pattern.shapes.map((shape, index) => h(shape.tag, { key: index, ...shape.attrs })),
    );

    const defs = h("defs", {}, [
      tile,
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
    ]);

    return h("g", { class: "vc-chart-background", style: { color: "var(--vc-bg-pattern-color)" } }, [
      defs,
      h("rect", {
        width: "100%",
        height: "100%",
        fill: `url(#${patternId})`,
        mask: `url(#${maskId})`,
      }),
    ]);
  },
});
