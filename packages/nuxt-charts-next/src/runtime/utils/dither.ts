/**
 * Dithered area fills.
 *
 * Instead of a smooth gradient, the area is filled with a tiling SVG
 * `<pattern>` of dots whose size steps down the height of the plot — the
 * halftone/ordered-dither look. Each variant is a list of rows; a row's
 * `radius` is a fraction of the tile size, so tiles stay crisp at any scale.
 */

/** Built-in dither treatments for an area fill. */
export type DitherVariant = "bayer" | "noise" | "fade" | "halftone";

/** All variants, in the order a UI should cycle through them. */
export const DITHER_VARIANTS: DitherVariant[] = ["bayer", "noise", "fade", "halftone"];

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

/* ------------------------------------------------------------------ *
 * Halftone — a true 1-bit ordered dither ramp.
 *
 * The dot variants paint circles whose *radius* tracks density, so the texture
 * always reads as "colour on transparent". A real ordered dither instead keeps
 * every cell the same size and switches it fully on or off against a threshold
 * matrix, sweeping the whole 0→100% coverage range:
 *
 *   ~0%   isolated specks of colour on the background
 *   ~25%  a sparse, evenly spread lattice
 *   ~50%  an exact checkerboard — the crossover
 *   ~75%  solid colour with isolated holes punched out
 *   ~100% solid colour
 *
 * Passing through the checkerboard is what makes it read as a gradient rather
 * than as a texture fading in alpha, and every cell stays hard-edged, which is
 * where the 1-bit / CRT character comes from.
 * ------------------------------------------------------------------ */

/** Id for the halftone coverage mask of a series. */
export function halftoneMaskId(dataKey: string, scope?: string): string {
  return `${ditherId(dataKey, scope)}-halftone`;
}

/**
 * Which end of the shape the fill is densest at.
 *
 * - `up`   — solid at the bottom, dissolving toward the top. Bars and columns,
 *            which are anchored on the baseline.
 * - `down` — solid at the top, dissolving toward the baseline. Area fills,
 *            where the line is the subject and the fill trails off under it.
 */
export type HalftoneDirection = "up" | "down";

/** One step of the ramp: a fixed coverage level held over a slice of the shape. */
export interface HalftoneBand {
  /** Band start, as a fraction of the shape's height (0 = top). */
  y0: number;
  /** Band end, as a fraction of the shape's height. */
  y1: number;
  /**
   * Cells *painted* in this band, as `[col, row]` pairs on the lattice. An
   * empty list is fully transparent; a full list is solid colour.
   */
  cells: Array<[number, number]>;
  /** Fraction of the lattice this band covers (0–1). Handy for tests/debug. */
  coverage: number;
}

/** Geometry for the halftone variant. */
export interface HalftonePattern {
  /** Cell edge in px — one dot occupies one cell. */
  cell: number;
  /** Edge of the repeating lattice in px (`cell * HALFTONE_GRID`). */
  tile: number;
  /** Bands ordered top → bottom of the shape. */
  bands: HalftoneBand[];
}

/**
 * An 8x8 Bayer matrix, generated from the recursive definition. 64 levels give
 * a ramp fine enough to look continuous; the 4x4 used by the dot variants
 * visibly banded across a tall bar.
 */
const HALFTONE_GRID = 8;

function bayerMatrix(size: number): number[][] {
  let matrix = [[0]];
  for (let n = 1; n < size; n *= 2) {
    const next: number[][] = [];
    for (let y = 0; y < n * 2; y++) next.push(new Array(n * 2).fill(0));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const base = (matrix[y]?.[x] ?? 0) * 4;
        next[y]![x] = base;
        next[y]![x + n] = base + 2;
        next[y + n]![x] = base + 3;
        next[y + n]![x + n] = base + 1;
      }
    }
    matrix = next;
  }
  return matrix;
}

const BAYER_8X8 = bayerMatrix(HALFTONE_GRID);

/**
 * Build the coverage ramp.
 *
 * Cells are sorted by Bayer threshold and revealed in that order, one more per
 * band. Because the matrix spreads low thresholds as far apart as possible,
 * every intermediate level is an evenly distributed lattice rather than a
 * clump — which is the whole point of an *ordered* dither.
 *
 * @param cell  Cell edge in px. Larger cells read chunkier.
 * @param opts  `direction` picks which end is solid. `from`/`to` clamp the
 *              coverage range, so a fill can stay partly transparent at its
 *              densest end (`to: 0.8`) or never fully vanish (`from: 0.1`).
 *              `bias` curves the ramp: >1 holds the sparse end longer.
 */
export function buildHalftonePattern(
  cell: number = 3,
  opts: {
    direction?: HalftoneDirection;
    from?: number;
    to?: number;
    bias?: number;
  } = {},
): HalftonePattern {
  const { direction = "down", from = 0, to = 1, bias = 1 } = opts;

  const order = halftoneCellOrder();
  const total = HALFTONE_GRID * HALFTONE_GRID;
  // One band per level, plus the fully-solid end.
  const steps = total + 1;
  const bands: HalftoneBand[] = [];

  for (let step = 0; step < steps; step++) {
    const y0 = step / steps;
    const y1 = (step + 1) / steps;

    // Position along the ramp, measured from the *sparse* end.
    const mid = (step + 0.5) / steps;
    const t = direction === "down" ? mid : 1 - mid;
    const coverage = from + (to - from) * (1 - t) ** bias;

    bands.push({
      y0,
      y1,
      cells: order.slice(0, Math.round(coverage * total)),
      coverage,
    });
  }

  return { cell, tile: cell * HALFTONE_GRID, bands };
}

/**
 * Cells of the lattice in reveal order — lowest Bayer threshold first.
 *
 * Exposed so a renderer that drives coverage from something other than a
 * vertical position (a donut's radius, say) can build the same evenly spread
 * levels without duplicating the sort.
 */
export function halftoneCellOrder(): Array<[number, number]> {
  const order: Array<[number, number]> = [];
  for (let row = 0; row < HALFTONE_GRID; row++) {
    for (let col = 0; col < HALFTONE_GRID; col++) {
      order.push([col, row]);
    }
  }
  order.sort((a, b) => (BAYER_8X8[a[1]]?.[a[0]] ?? 0) - (BAYER_8X8[b[1]]?.[b[0]] ?? 0));
  return order;
}

/** Cells of the lattice covering `coverage` (0–1), evenly spread. */
export function halftoneCellsFor(coverage: number): Array<[number, number]> {
  const total = HALFTONE_GRID * HALFTONE_GRID;
  const clamped = Math.max(0, Math.min(1, coverage));
  return halftoneCellOrder().slice(0, Math.round(clamped * total));
}

/** Number of cells along one edge of the halftone lattice. */
export const HALFTONE_LATTICE = HALFTONE_GRID;
