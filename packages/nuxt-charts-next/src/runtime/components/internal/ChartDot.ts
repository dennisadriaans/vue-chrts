import { defineComponent, h, type PropType, type VNode } from "vue";
import type { DotVariant } from "../../utils/variants";

/**
 * A point marker on a line, area or radar series.
 *
 * Each variant is built from concentric discs rather than a stroked circle, so
 * the "border" is a real filled ring: an SVG `stroke` would straddle the radius
 * and leave a half-pixel of series colour bleeding through the ring at small
 * sizes, which is exactly where these markers live.
 *
 * The ring colour is the chart surface (`--vc-surface-bg`), so a bordered dot
 * reads as punched out of the background and stays legible over a busy fill in
 * either theme.
 *
 * Render-function component so the circles land in the SVG namespace — the same
 * constraint that shapes `GradientDefs`.
 */
export default defineComponent({
  name: "ChartDot",
  props: {
    /** Centre of the marker, in plot coordinates. */
    cx: { type: Number, default: undefined },
    cy: { type: Number, default: undefined },
    /** Series colour the marker paints from. */
    color: { type: String, required: true },
    variant: { type: String as PropType<DotVariant>, default: "default" },
    /** Base radius in px. Each variant scales its rings from this. */
    size: { type: Number, default: 3 },
    /** Marker opacity, so a dimmed series dims its dots with it. */
    opacity: { type: Number, default: 1 },
  },
  setup: (props) => () => {
    // vccs calls the dot slot for every point, including ones clipped out of
    // the plot — those arrive without coordinates and must not be drawn.
    if (props.cx === undefined || props.cy === undefined) return null;

    const centre = { cx: props.cx, cy: props.cy };
    const surface = "var(--vc-surface-bg)";
    const r = props.size;

    const rings: VNode[] = [];

    switch (props.variant) {
      case "border":
        // A wide surface-coloured ring around a smaller coloured core.
        rings.push(
          h("circle", { ...centre, r: r * 2, fill: surface }),
          h("circle", { ...centre, r: r * 1.17, fill: props.color }),
        );
        break;

      case "colored-border":
        // The inverse: a thin coloured ring around a surface-coloured core.
        rings.push(
          h("circle", { ...centre, r: r + 0.5, fill: props.color }),
          h("circle", { ...centre, r: r - 0.5, fill: surface }),
        );
        break;

      case "ping":
        // A resting dot under a ring that expands and fades on a loop. Declared
        // with SVG <animate> rather than a JS frame loop, so it costs nothing
        // per frame and keeps time while the tab is backgrounded.
        rings.push(
          h("circle", { ...centre, r, fill: props.color, "fill-opacity": 0.35 }, [
            h("animate", {
              attributeName: "r",
              values: `${r};${r * 3}`,
              dur: "1.6s",
              repeatCount: "indefinite",
            }),
            h("animate", {
              attributeName: "fill-opacity",
              values: "0.35;0",
              dur: "1.6s",
              repeatCount: "indefinite",
            }),
          ]),
          h("circle", { ...centre, r, fill: props.color }),
        );
        break;

      default:
        rings.push(h("circle", { ...centre, r, fill: props.color }));
    }

    return h("g", { class: "v-charts-dot", opacity: props.opacity }, rings);
  },
});
