import { defineComponent, h, type PropType } from "vue";
import { strokeGradientId, type StrokeGradientStop } from "../../utils/gradient";

type SeriesItem = { dataKey: string };

/** Horizontal SVG gradients shared by line and area outlines. */
export default defineComponent({
  name: "StrokeGradientDefs",
  props: {
    series: { type: Array as PropType<SeriesItem[]>, required: true },
    stops: { type: Array as PropType<StrokeGradientStop[]>, required: true },
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
            id: strokeGradientId(series.dataKey, props.scope),
            key: series.dataKey,
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0,
          },
          props.stops.map((stop, index) =>
            h("stop", {
              key: index,
              offset: stop.offset,
              "stop-color": stop.color,
              "stop-opacity": stop.stopOpacity ?? 1,
            }),
          ),
        ),
      ),
    ),
});
