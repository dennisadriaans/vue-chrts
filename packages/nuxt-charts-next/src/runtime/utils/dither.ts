/**
 * Dithered area fills.
 *
 * Instead of a smooth gradient, the area is filled with a tiling SVG
 * `<pattern>` of dots whose size steps down the height of the plot — the
 * halftone/ordered-dither look. Each variant is a list of rows; a row's
 * `radius` is a fraction of the tile size, so tiles stay crisp at any scale.
 */

/** Built-in dither treatments for an area fill. */
export type DitherVariant = "bayer" | "noise" | "fade";

/** All variants, in the order a UI should cycle through them. */
export const DITHER_VARIANTS: DitherVariant[] = ["bayer", "noise", "fade"];

/**
 * Build a deterministic pattern id so the `<defs>` element and the
 * `fill="url(#id)"` reference agree. Mirrors `gradientId`.
 */
export function ditherId(dataKey: string, scope?: string): string {
  const id = scope ? `${scope}-${dataKey}` : dataKey;
  return `nc-dither-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

/**
 * Id for the repeating dot tile of a series.
 *
 * Separate from `ditherId` because a faded dither composes two paints: this
 * tile is painted over a gradient wash inside the plot-sized pattern that
 * `ditherId` names and the area's `fill` actually references.
 */
export function dotsId(dataKey: string, scope?: string): string {
  return `${ditherId(dataKey, scope)}-dots`;
}

/**
 * Id for the shared vertical fade applied to the dot texture. One per chart
 * scope — the stops carry opacity only, so every series can reuse it.
 */
export function ditherFadeMaskId(scope: string): string {
  return `nc-dither-fade-${scope.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

/** One dot within a dither tile, in tile-relative units (0–1). */
export interface DitherDot {
  /** Horizontal centre, as a fraction of the tile width. */
  cx: number;
  /** Vertical centre, as a fraction of the tile height. */
  cy: number;
  /** Dot radius, as a fraction of the tile width. */
  r: number;
}

/** Geometry + sizing for one dither variant. */
export interface DitherPattern {
  /** Tile edge length in user units (px). */
  tile: number;
  /** Dots within a single tile. */
  dots: DitherDot[];
}

/**
 * A 4x4 ordered (Bayer) threshold matrix. Classic halftone: dots on a regular
 * grid with sizes driven by the matrix, giving an even, print-like texture.
 */
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/**
 * Fixed pseudo-random offsets for the `noise` variant. Hardcoded rather than
 * generated so the pattern is stable across renders and SSR/client hydration.
 */
const NOISE_OFFSETS = [
  [0.18, 0.72, 0.41, 0.94],
  [0.63, 0.07, 0.86, 0.29],
  [0.35, 0.51, 0.12, 0.68],
  [0.79, 0.24, 0.57, 0.03],
];

const GRID = 4;
const DEFAULT_TILE = 8;

/**
 * Build the dot geometry for a variant.
 *
 * - `bayer` — uniform grid, radius stepped by the Bayer matrix.
 * - `noise` — same radii, but each dot jittered off the grid for a grain look.
 * - `fade`  — radius scales with the row, so the tile reads denser at its top;
 *   stacked vertically this makes the fill thin out toward the baseline.
 */
export function buildDitherPattern(
  variant: DitherVariant,
  tile: number = DEFAULT_TILE,
): DitherPattern {
  const dots: DitherDot[] = [];
  const cell = 1 / GRID;
  const maxRadius = cell * 0.5;

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const threshold = (BAYER_4X4[row]?.[col] ?? 0) / (GRID * GRID);
      // Bayer/noise use the matrix directly; fade ramps density by row instead.
      const weight = variant === "fade" ? 1 - row / GRID : 1 - threshold;
      const r = maxRadius * weight;
      if (r <= 0) continue;

      const jitter = variant === "noise" ? ((NOISE_OFFSETS[row]?.[col] ?? 0.5) - 0.5) * cell : 0;

      dots.push({
        cx: col * cell + cell / 2 + jitter,
        cy: row * cell + cell / 2 + jitter,
        r,
      });
    }
  }

  return { tile, dots };
}
