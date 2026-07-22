import { defineComponent, h, type PropType } from "vue";
import {
  buildDitherPattern,
  ditherFadeMaskId,
  ditherId,
  dotsId,
  type DitherVariant,
} from "../../utils/dither";
import type { GradientStop } from "../../utils/gradient";

type SeriesItem = { dataKey: string; color: string };

/**
 * Renders one tiling `<pattern>` of dots per series inside a `<defs>` block,
 * for the dithered (halftone) area fill.
 *
 * When `fadeStops` is set, also emits a shared vertical opacity mask (and a
 * scoped style that applies it only to `.v-charts-area-area`) so the dither
 * dissolves toward the baseline the same way a gradient fill does — without
 * fading the stroke, which shares attrs with the fill path in `vccs`.
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
    /**
     * When set, compose the dither with a vertical opacity fade (same stops
     * shape as `gradientStops`). Omit for a flat, full-opacity dither.
     */
    fadeStops: { type: Array as PropType<GradientStop[]>, default: undefined },
    /**
     * Plot height in px. Used to size the wash gradient so it spans the chart
     * rather than repeating with the dot tile.
     */
    height: { type: Number, default: 0 },
  },
  setup: (props) => () => {
    const pattern = buildDitherPattern(props.variant, props.tile);
    const stops = props.fadeStops;

    /** The repeating dot tile. Always userSpaceOnUse so dots keep px sizing. */
    const dotPatterns = props.series.map((series) =>
      h(
        "pattern",
        {
          id: dotsId(series.dataKey, props.scope),
          key: `dots-${series.dataKey}`,
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
    );

    // Without a fade the dots *are* the fill, so the referenced id is the tile.
    if (!stops?.length) {
      const aliases = props.series.map((series) =>
        h("pattern", {
          id: ditherId(series.dataKey, props.scope),
          key: `alias-${series.dataKey}`,
          width: pattern.tile,
          height: pattern.tile,
          patternUnits: "userSpaceOnUse",
          href: `#${dotsId(series.dataKey, props.scope)}`,
        }),
      );
      return h("defs", {}, [...dotPatterns, ...aliases]);
    }

    /**
     * The fill actually referenced by the area: one plot-sized tile holding the
     * gradient wash with the dot tile painted over it. Composing both into a
     * single paint is what lets a dithered area keep the ordinary
     * colour-to-transparent area gradient — `vccs`'s `Curve` declares `class` as
     * a prop, so a CSS-applied mask never reaches the fill path.
     */
    const height = props.height || 1;

    /**
     * Colour-agnostic copy of the fade, used to thin the dot texture. Shared by
     * every series since the stops only carry opacity.
     */
    const fadeMaskId = `${ditherFadeMaskId(props.scope)}-dots`;
    const fadeGradId = `${fadeMaskId}-grad`;

    const fadeDefs = [
      h(
        "linearGradient",
        { id: fadeGradId, key: "dot-fade-grad", x1: 0, y1: 0, x2: 0, y2: 1 },
        stops.map((stop, index) =>
          h("stop", {
            key: index,
            offset: stop.offset,
            "stop-color": "#fff",
            // Normalise so the texture starts fully opaque and only the *shape*
            // of the ramp is taken from the caller's stops.
            "stop-opacity": stop.stopOpacity / (stops[0]?.stopOpacity || 1),
          }),
        ),
      ),
      h(
        "mask",
        { id: fadeMaskId, key: "dot-fade-mask", maskUnits: "userSpaceOnUse" },
        [
          h("rect", {
            x: 0,
            y: 0,
            width: pattern.tile,
            height,
            fill: `url(#${fadeGradId})`,
          }),
        ],
      ),
    ];

    const combos = props.series.map((series) => {
      const gradId = `${ditherId(series.dataKey, props.scope)}-wash`;
      return h(
        "pattern",
        {
          id: ditherId(series.dataKey, props.scope),
          key: `combo-${series.dataKey}`,
          x: 0,
          y: 0,
          width: pattern.tile,
          height,
          patternUnits: "userSpaceOnUse",
        },
        [
          h("rect", {
            key: "wash",
            x: 0,
            y: 0,
            width: pattern.tile,
            height,
            fill: `url(#${gradId})`,
          }),
          h("rect", {
            key: "dots",
            x: 0,
            y: 0,
            width: pattern.tile,
            height,
            fill: `url(#${dotsId(series.dataKey, props.scope)})`,
            // Fade the texture on the same ramp as the wash, otherwise the dots
            // stay at full strength and the fill never reaches the baseline.
            mask: `url(#${fadeMaskId})`,
          }),
        ],
      );
    });

    /** Series-coloured vertical fade, in plot space, feeding each wash rect. */
    const washGradients = props.series.map((series) =>
      h(
        "linearGradient",
        {
          id: `${ditherId(series.dataKey, props.scope)}-wash`,
          key: `wash-grad-${series.dataKey}`,
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops.map((stop, index) =>
          h("stop", {
            key: index,
            offset: stop.offset,
            "stop-color": series.color,
            "stop-opacity": stop.stopOpacity,
          }),
        ),
      ),
    );

    return h("defs", {}, [...dotPatterns, ...washGradients, ...fadeDefs, ...combos]);
  },
});
