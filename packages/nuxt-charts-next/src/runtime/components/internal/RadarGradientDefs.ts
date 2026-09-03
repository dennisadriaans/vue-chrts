import { defineComponent, h, type PropType } from "vue";
import { variantId, type RadarVariant } from "../../utils/variants";

type SeriesItem = { dataKey: string; color: string };

/** SVG radial gradients used by the two directional radar fill variants. */
export default defineComponent({
  name: "RadarGradientDefs",
  props: {
    series: { type: Array as PropType<SeriesItem[]>, required: true },
    variant: {
      type: String as PropType<Extract<RadarVariant, "gradient" | "gradient-reverse">>,
      required: true,
    },
    scope: { type: String, required: true },
    opacity: { type: Number, required: true },
  },
  setup: (props) => () =>
    h(
      "defs",
      {},
      props.series.map((series) => {
        const reverse = props.variant === "gradient-reverse";
        return h(
          "radialGradient",
          {
            id: radarGradientId(series.dataKey, props.scope),
            key: series.dataKey,
            cx: "50%",
            cy: "50%",
            r: "50%",
          },
          [
            h("stop", {
              offset: "0%",
              "stop-color": series.color,
              "stop-opacity": reverse ? 0 : props.opacity,
            }),
            h("stop", {
              offset: "100%",
              "stop-color": series.color,
              "stop-opacity": reverse ? props.opacity : 0,
            }),
          ],
        );
      }),
    ),
});

export function radarGradientId(dataKey: string, scope: string): string {
  return variantId("radar-gradient", dataKey, scope);
}
