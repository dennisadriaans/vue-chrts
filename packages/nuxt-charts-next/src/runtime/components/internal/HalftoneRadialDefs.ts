import { defineComponent, h } from "vue";
import { HALFTONE_LATTICE, halftoneCellsFor } from "../../utils/dither";

/**
 * Radial halftone `<defs>` for a donut ring.
 *
 * The cartesian variants ramp coverage along a y position; a ring instead runs
 * it along the *radius*, so the band is solid at the outer edge and dissolves
 * toward the hole. The ramp is built from concentric annuli, each clipped to a
 * ring and filled with one coverage level of the shared lattice.
 *
 * Emits one pattern per segment colour, sized to the whole chart box, so a
 * sector can reference it as `fill` and pick up the ring geometry underneath.
 *
 * Built with `h()` for the same namespace reason as `GradientDefs`: SVG in a
 * template not lexically inside `<svg>` is parsed as HTML and dropped.
 */

/** Id of the radial halftone paint for one segment. */
export function halftoneRadialId(scope: string, index: number): string {
  return `nc-htr-${scope.replace(/[^a-zA-Z0-9_-]/g, "-")}-s${index}`;
}

export default defineComponent({
  name: "HalftoneRadialDefs",
  props: {
    /** Unique per chart instance. */
    scope: { type: String, required: true },
    /** One entry per donut segment, in data order. */
    colors: { type: Array as () => string[], required: true },
    /** Centre of the ring in chart coordinates. */
    cx: { type: Number, required: true },
    cy: { type: Number, required: true },
    /** Ring bounds in px. */
    innerRadius: { type: Number, required: true },
    outerRadius: { type: Number, required: true },
    /** Cell edge in px. One lattice tile is `cell * 8`. */
    cell: { type: Number, default: 2 },
    /** How many concentric coverage steps to draw across the ring. */
    steps: { type: Number, default: 10 },
    /** Coverage at the inner edge of the ring (0–1). */
    from: { type: Number, default: 0 },
    /** Coverage at the outer edge of the ring (0–1). */
    to: { type: Number, default: 1 },
    /** Ramp curve; above 1 keeps the inner edge sparse for longer. */
    bias: { type: Number, default: 1 },
  },
  setup: (props) => () => {
    const tile = props.cell * HALFTONE_LATTICE;
    const span = Math.max(0, props.outerRadius - props.innerRadius);
    const nodes: ReturnType<typeof h>[] = [];

    /**
     * Lattice tiles, one per (colour, level). Shared by every ring of a
     * segment, so the texture stays aligned across the whole band rather than
     * restarting at each annulus boundary.
     */
    for (const [index, color] of props.colors.entries()) {
      for (let level = 0; level < props.steps; level++) {
        const t = props.steps <= 1 ? 1 : level / (props.steps - 1);
        const coverage = props.from + (props.to - props.from) * t ** props.bias;
        const id = `${halftoneRadialId(props.scope, index)}-l${level}`;
        nodes.push(
          h(
            "pattern",
            { id, key: id, width: tile, height: tile, patternUnits: "userSpaceOnUse" },
            halftoneCellsFor(coverage).map(([col, row]) =>
              h("rect", {
                key: `${col}-${row}`,
                x: col * props.cell,
                y: row * props.cell,
                width: props.cell,
                height: props.cell,
                fill: color,
              }),
            ),
          ),
        );
      }
    }

    /**
     * The paint each sector references: concentric annuli from the hole
     * outward, each drawn with its level's lattice.
     *
     * Annuli are stroked circles rather than filled rings — a stroke of width
     * `step` centred on the mid-radius is exactly the band, and avoids needing
     * an even-odd fill rule with two subpaths.
     */
    for (const [index] of props.colors.entries()) {
      const id = halftoneRadialId(props.scope, index);
      const step = span / props.steps;
      const rings = Array.from({ length: props.steps }, (_, level) => {
        // Level 0 is the sparse end and sits against the hole.
        const r0 = props.innerRadius + level * step;
        return h("circle", {
          key: level,
          cx: props.cx,
          cy: props.cy,
          r: r0 + step / 2,
          fill: "none",
          // Overlap by a hair; exact edges leave seams after device rounding.
          "stroke-width": step + 0.5,
          stroke: `url(#${id}-l${level})`,
        });
      });

      nodes.push(
        h(
          "pattern",
          {
            id,
            key: id,
            x: 0,
            y: 0,
            width: (props.cx + props.outerRadius) * 2,
            height: (props.cy + props.outerRadius) * 2,
            patternUnits: "userSpaceOnUse",
          },
          rings,
        ),
      );
    }

    return h("defs", {}, nodes);
  },
});
