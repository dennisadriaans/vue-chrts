import { defineComponent, h, type PropType } from "vue";
import { gradientId, type GradientStop } from "../../utils/gradient";

type SeriesItem = { dataKey: string; color: string };

/**
 * Renders one vertical `<linearGradient>` per series inside a `<defs>` block.
 *
 * This is a render-function component on purpose: SVG elements like
 * `<linearGradient>` / `<stop>` written in an SFC `<template>` that is *not*
 * lexically nested inside an `<svg>` tag are parsed in the HTML namespace and
 * silently dropped when placed via a component slot. Building them with `h()`
 * sets the correct SVG namespace so the gradient — and therefore the
 * `fill="url(#…)"` reference on each area — resolves.
 */
export default defineComponent({
  name: "GradientDefs",
  props: {
    series: {
      type: Array as PropType<SeriesItem[]>,
      required: true,
    },
    stops: { type: Array as PropType<GradientStop[]>, required: true },
    scope: { type: String, required: true },
  },
  setup: (props) => () =>
    h(
      "defs",
      {},
      props.series.map((series) =>
        h(
          "linearGradient",
          {
            id: gradientId(series.dataKey, props.scope),
            key: series.dataKey,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          props.stops.map((stop, index) =>
            h("stop", {
              key: index,
              offset: stop.offset,
              "stop-color": series.color,
              "stop-opacity": stop.stopOpacity,
            }),
          ),
        ),
      ),
    ),
});
