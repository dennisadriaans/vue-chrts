import { defineComponent, h, inject, type PropType } from "vue";
import type { LegendPosition } from "../../enums";
import { legendPositionToLegendProps } from "../../utils/legend";
import type { LegendIndicatorVariant } from "../../utils/variants";
import ChartLegend from "./ChartLegend.vue";
import { SSR_LAYOUT_PASS_KEY, STORE_KEY, type ChartStoreContext } from "./ChartSsrBridge";

/** Height reserved for a one-row legend plus its inset, in px. */
const LEGEND_HEIGHT = 32;

const JUSTIFY = { left: "flex-start", center: "center", right: "flex-end" } as const;

interface LegendEntry {
  value: string;
  color?: string;
  inactive?: boolean;
  type?: string;
}

/**
 * Server-only stand-in for the `vccs` `<Legend>`, which draws through a
 * teleport into an element it measures and so emits nothing on the server.
 *
 * Place it after `<Legend>`. It reserves one legend row in the chart layout and
 * draws the entries in that band, so the plot does not jump when the real
 * legend takes over in the browser.
 */
export default defineComponent({
  name: "ChartSsrLegend",
  props: {
    position: { type: String as PropType<LegendPosition>, default: undefined },
    variant: { type: String as PropType<LegendIndicatorVariant>, default: undefined },
    colors: { type: Object as PropType<Record<string, string>>, default: undefined },
  },
  setup(props) {
    const pass = inject(SSR_LAYOUT_PASS_KEY, null);
    const context = inject<ChartStoreContext | null>(STORE_KEY, null);
    if (!pass || !context) return () => null;

    const { store } = context;
    store.dispatch({
      type: "legend/setLegendSize",
      payload: { width: store.getState().layout.width, height: LEGEND_HEIGHT },
    });

    return () => {
      const { layout, legend } = store.getState();
      const seen = new Set<string>();
      const entries = (legend.payload.flat() as LegendEntry[]).filter((entry) => {
        if (entry.type === "none" || seen.has(entry.value)) return false;
        seen.add(entry.value);
        return true;
      });
      if (!entries.length) return null;

      const { align, verticalAlign } = legendPositionToLegendProps(props.position);
      const left = layout.margin.left ?? 0;
      const top = verticalAlign === "top";
      return h(
        "foreignObject",
        {
          x: left,
          y: top ? (layout.margin.top ?? 0) : layout.height - (layout.margin.bottom ?? 0) - LEGEND_HEIGHT,
          width: Math.max(layout.width - left - (layout.margin.right ?? 0), 0),
          height: LEGEND_HEIGHT,
        },
        [
          h(
            "div",
            {
              xmlns: "http://www.w3.org/1999/xhtml",
              style: {
                display: "flex",
                height: "100%",
                justifyContent: JUSTIFY[align],
                alignItems: top ? "flex-start" : "flex-end",
              },
            },
            [h(ChartLegend, { payload: entries, variant: props.variant, colors: props.colors })],
          ),
        ],
      );
    };
  },
});
