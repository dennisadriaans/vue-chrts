import { defineComponent, h, type PropType } from "vue";
import { buildDitherPattern, ditherId, type DitherVariant } from "../../utils/dither";

type SeriesItem = { dataKey: string; color: string };

/**
 * Renders one tiling `<pattern>` of dots per series inside a `<defs>` block,
 * for the dithered (halftone) area fill.
 *
 * Like `GradientDefs`, this is a render-function component on purpose: SVG
 * elements written in an SFC `<template>` that is not lexically nested inside
 * an `<svg>` tag are parsed in the HTML namespace and silently dropped when
 * placed via a component slot. Building them with `h()` sets the correct SVG
 * namespace so `fill="url(#…)"` resolves.
 */
export default defineComponent({
  name: "DitherDefs",
  props: {
    series: {
      type: Array as PropType<SeriesItem[]>,
      required: true,
    },
    variant: { type: String as PropType<DitherVariant>, required: true },
    scope: { type: String, required: true },
    /** Tile edge length in px. Smaller tiles read as a finer texture. */
    tile: { type: Number, default: 8 },
  },
  setup: (props) => () => {
    const pattern = buildDitherPattern(props.variant, props.tile);

    return h(
      "defs",
      {},
      props.series.map((series) =>
        h(
          "pattern",
          {
            id: ditherId(series.dataKey, props.scope),
            key: series.dataKey,
            width: pattern.tile,
            height: pattern.tile,
            patternUnits: "userSpaceOnUse",
          },
          pattern.dots.map((dot, index) =>
            h("circle", {
              key: index,
              cx: dot.cx * pattern.tile,
              cy: dot.cy * pattern.tile,
              r: dot.r * pattern.tile,
              fill: series.color,
            }),
          ),
        ),
      ),
    );
  },
});
