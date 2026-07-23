import { defineComponent, h, type PropType } from "vue";
import {
  HALFTONE_LATTICE,
  halftoneCellsFor,
  type HalftoneDirection,
} from "../../utils/dither";

/**
 * Standalone halftone `<defs>` for shapes that are not a cartesian area.
 *
 * `DitherDefs` drives coverage from a y position inside the plot, which suits an
 * area fill but nothing else. Bars are anchored on their own baseline and donut
 * rings run along a radius, so both need the ramp expressed in their own
 * geometry. This component emits the lattice patterns and lets the caller map
 * them onto whatever axis it likes.
 *
 * Built with `h()` rather than an SFC `<template>` for the same reason as
 * `GradientDefs`: SVG written in a template that is not lexically inside an
 * `<svg>` tag is parsed in the HTML namespace and silently dropped, so
 * `fill="url(#…)"` would never resolve.
 */

/** Id of one coverage level's tile. Levels are indexed 0…steps-1, sparse first. */
export function halftoneLevelId(scope: string, level: number): string {
  return `nc-ht-${scope.replace(/[^a-zA-Z0-9_-]/g, "-")}-l${level}`;
}

/**
 * Coverage for a level, given the ramp shape.
 *
 * Shared by every caller so a bar and a donut built from the same `from`/`to`
 * agree on what "level 3 of 12" means.
 */
export function halftoneCoverage(
  level: number,
  steps: number,
  from: number,
  to: number,
  bias: number,
): number {
  const t = steps <= 1 ? 1 : level / (steps - 1);
  return from + (to - from) * t ** bias;
}

export default defineComponent({
  name: "HalftoneDefs",
  props: {
    /**
     * Unique per chart instance *and* per colour — the lattice is painted in
     * the series colour, so two series cannot share a level set. Callers pass
     * `` `${chartScope}-${seriesKey}` ``.
     */
    scope: { type: String, required: true },
    /** Cell edge in px. One lattice tile is `cell * 8`. */
    cell: { type: Number, default: 2 },
    /** How many discrete coverage levels to emit. */
    steps: { type: Number, default: 12 },
    /** Coverage at the sparse end of the ramp (0–1). */
    from: { type: Number, default: 0 },
    /** Coverage at the dense end of the ramp (0–1). */
    to: { type: Number, default: 1 },
    /** Ramp curve; above 1 holds the sparse end longer. */
    bias: { type: Number, default: 1 },
    /**
     * Paint colour for the cells. Masks want `#fff` (white = keep); a pattern
     * used directly as a fill wants the series colour.
     */
    color: { type: String, default: "#fff" },
    /** Unused by the geometry — accepted so callers can pass it through. */
    direction: { type: String as PropType<HalftoneDirection>, default: "up" },
  },
  setup: (props) => () => {
    const tile = props.cell * HALFTONE_LATTICE;

    const levels = Array.from({ length: props.steps }, (_, level) => {
      const coverage = halftoneCoverage(
        level,
        props.steps,
        props.from,
        props.to,
        props.bias,
      );
      const id = halftoneLevelId(props.scope, level);
      return h(
        "pattern",
        {
          id,
          key: id,
          width: tile,
          height: tile,
          patternUnits: "userSpaceOnUse",
        },
        // Squares, not circles: at these sizes a circle anti-aliases into a
        // soft blob and loses the hard 1-bit edge the effect depends on.
        halftoneCellsFor(coverage).map(([col, row]) =>
          h("rect", {
            key: `${col}-${row}`,
            x: col * props.cell,
            y: row * props.cell,
            width: props.cell,
            height: props.cell,
            fill: props.color,
          }),
        ),
      );
    });

    return h("defs", {}, levels);
  },
});
