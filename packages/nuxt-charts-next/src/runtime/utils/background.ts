/**
 * Decorative background textures drawn behind a chart's plot area.
 *
 * Each variant is one tiling SVG `<pattern>` described declaratively here, so
 * the renderer (`internal/ChartBackground`) stays a single generic loop instead
 * of a switch with eleven branches. Every shape paints `currentColor`, letting
 * the whole texture take its colour from one CSS token — and therefore follow
 * light / dark mode without any of this code knowing about themes.
 */

/** Built-in background textures. */
export type BackgroundVariant =
  | "dots"
  | "grid"
  | "cross-hatch"
  | "diagonal-lines"
  | "plus"
  | "falling-triangles"
  | "4-pointed-star"
  | "tiny-checkers"
  | "overlapping-circles"
  | "wiggle-lines"
  | "bubbles";

/** All variants, in the order a UI should cycle through them. */
export const BACKGROUND_VARIANTS: BackgroundVariant[] = [
  "dots",
  "grid",
  "cross-hatch",
  "diagonal-lines",
  "plus",
  "falling-triangles",
  "4-pointed-star",
  "tiny-checkers",
  "overlapping-circles",
  "wiggle-lines",
  "bubbles",
];

/** One shape inside a background tile. `tag` is the SVG element to emit. */
export interface BackgroundShape {
  tag: "circle" | "path" | "line" | "polygon" | "rect";
  attrs: Record<string, string | number>;
}

/** Geometry of one background texture's repeating tile. */
export interface BackgroundPattern {
  /** Tile width in user units (px). */
  width: number;
  /** Tile height in user units (px). */
  height: number;
  /** Optional `patternTransform`, e.g. a rotation or scale. */
  transform?: string;
  /** Shapes drawn inside a single tile. */
  shapes: BackgroundShape[];
}

/** Shorthand for a stroked shape — the outline textures share these attrs. */
function stroked(width: number, opacity?: number): Record<string, string | number> {
  return {
    fill: "none",
    stroke: "currentColor",
    "stroke-width": width,
    ...(opacity === undefined ? {} : { "stroke-opacity": opacity }),
  };
}

/** Shorthand for a filled shape. */
function filled(opacity: number): Record<string, string | number> {
  return { fill: "currentColor", "fill-opacity": opacity };
}

/**
 * Tile geometry per variant.
 *
 * The long `path` data are single-tile motifs whose edges line up with the tile
 * bounds, so the texture repeats seamlessly rather than showing a visible seam.
 */
export const BACKGROUND_PATTERNS: Record<BackgroundVariant, BackgroundPattern> = {
  "dots": {
    width: 20,
    height: 20,
    shapes: [{ tag: "circle", attrs: { cx: 2, cy: 2, r: 1, fill: "currentColor" } }],
  },

  "grid": {
    width: 20,
    height: 20,
    shapes: [{ tag: "path", attrs: { d: "M 20 0 L 0 0 0 20", ...stroked(0.5) } }],
  },

  "cross-hatch": {
    width: 20,
    height: 20,
    shapes: [{ tag: "path", attrs: { d: "M 0 0 L 20 20 M 20 0 L 0 20", ...stroked(0.5, 0.6) } }],
  },

  "diagonal-lines": {
    width: 6,
    height: 6,
    transform: "rotate(45)",
    shapes: [
      { tag: "line", attrs: { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "currentColor", "stroke-width": 0.5 } },
    ],
  },

  "plus": {
    width: 16,
    height: 16,
    shapes: [
      {
        tag: "path",
        attrs: { d: "M 8 4 L 8 12 M 4 8 L 12 8", ...stroked(0.5), "stroke-linecap": "round" },
      },
    ],
  },

  "falling-triangles": {
    width: 18,
    height: 36,
    shapes: [
      {
        tag: "path",
        attrs: {
          d: "M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z",
          transform: "scale(0.5)",
          ...filled(0.4),
        },
      },
    ],
  },

  "4-pointed-star": {
    width: 16,
    height: 16,
    shapes: [
      {
        tag: "polygon",
        attrs: {
          points: "5 3 8 4 5 5 4 8 3 5 0 4 3 3 4 0 5 3",
          "fill-rule": "evenodd",
          ...filled(0.4),
        },
      },
    ],
  },

  "tiny-checkers": {
    width: 8,
    height: 8,
    shapes: [
      {
        tag: "path",
        attrs: { d: "M0 0h4v4H0V0zm4 4h4v4H4V4z", "fill-rule": "evenodd", ...filled(0.2) },
      },
    ],
  },

  "overlapping-circles": {
    width: 40,
    height: 40,
    shapes: [
      {
        tag: "path",
        attrs: {
          d: "M25 25c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5c0 2.762-2.238 5-5 5s-5-2.238-5-5 2.238-5 5-5zM5 5c0-2.762 2.238-5 5-5s5 2.238 5 5-2.238 5-5 5c0 2.762-2.238 5-5 5S0 12.762 0 10s2.238-5 5-5zm5 4c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm20 20c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z",
          "fill-rule": "evenodd",
          ...filled(0.4),
        },
      },
    ],
  },

  "wiggle-lines": {
    width: 52,
    height: 26,
    transform: "scale(0.6)",
    shapes: [
      {
        tag: "path",
        attrs: {
          d: "M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z",
          ...filled(0.4),
        },
      },
    ],
  },

  "bubbles": {
    width: 100,
    height: 100,
    transform: "scale(0.6667)",
    shapes: [
      {
        tag: "path",
        attrs: {
          d: "M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z",
          "fill-rule": "evenodd",
          ...filled(0.4),
        },
      },
    ],
  },
};
