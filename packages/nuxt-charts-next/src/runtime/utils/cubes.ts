/**
 * Cube-grid bar geometry.
 *
 * Turns a column band + value segment into a vertical stack of square cells
 * (GitHub-contribution / Lego style). Pure functions — no Vue — so layout can
 * be unit-tested and shared across single, grouped, and stacked series.
 */

/** One square in a cube column. */
export interface CubeRect {
  x: number;
  y: number;
  size: number;
  radius: number;
  /** 0–1 fill opacity. Tapers with size when `minSize` is set. */
  opacity: number;
  /** True when this cell represents the data value. */
  filled: boolean;
}

/** Full-column band from the plot top to the baseline (`vccs` bar `background`). */
export interface CubeColumnBand {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutCubeColumnInput {
  column: CubeColumnBand;
  /** Already-scaled segment height in px. */
  valueHeight: number;
  /**
   * SVG y of the segment top. When omitted, the segment sits on the baseline
   * (`valueHeight` tall). Stacked series pass the real bar `y` here so each
   * layer owns a contiguous cube range.
   */
  segmentY?: number;
  /**
   * Draw ghost cubes for unfilled rows. For stacked bars only the first series
   * should do this; later series paint fills only. Default `true`.
   */
  includeEmpty?: boolean;
  /** Gap between cubes in px. Default 2. */
  gap?: number;
  /** Corner radius per cube. Default 2. */
  radius?: number;
  /**
   * Preferred cube edge length. Clamped to the band width so each column stays
   * a straight, centered stack. Default 10.
   */
  preferredSize?: number;
  /**
   * When set below `preferredSize`, cube edge length tapers from preferred at
   * the top of the plot down to this size at the baseline. Size is based on
   * absolute row position so every horizontal line shares one cube size.
   * Grid stride stays based on preferred size; each square is centered in its cell.
   * Opacity also tapers top → bottom (see `minOpacity`).
   */
  minSize?: number;
  /**
   * Floor opacity when size-tapering (top stays 1). Default 0.05 — nearly
   * invisible at the baseline. Ignored unless `minSize` enables taper.
   */
  minOpacity?: number;
}

export const DEFAULT_CUBE_GAP = 2;
export const DEFAULT_CUBE_RADIUS = 2;
export const DEFAULT_CUBE_SIZE = 10;
export const DEFAULT_CUBE_EMPTY_COLOR = "rgba(128, 128, 128, 0.14)";
/** Baseline opacity when size-tapering — almost invisible at the bottom. */
export const DEFAULT_CUBE_MIN_OPACITY = 0.05;

/**
 * Map a value height onto an integer cube count.
 * `valueHeight / columnHeight` mirrors the y-scale without needing yMax.
 */
export function valueToCubeCount(
  valueHeight: number,
  columnHeight: number,
  rows: number,
): number {
  if (rows <= 0 || columnHeight <= 0 || valueHeight <= 0) return 0;
  return Math.min(rows, Math.max(0, Math.round((valueHeight / columnHeight) * rows)));
}

/** Resolve cube size + row count for a column band. */
export function resolveCubeGrid(
  column: CubeColumnBand,
  gap: number = DEFAULT_CUBE_GAP,
  preferredSize: number = DEFAULT_CUBE_SIZE,
): { size: number; rows: number; stride: number; originX: number; originY: number } | null {
  const { x, y, width, height } = column;
  if (!(width > 0) || !(height > 0)) return null;

  // Clamp to band width so stacks stay straight (no overhang wobble).
  const size = Math.max(1, Math.min(width, preferredSize));
  const stride = size + gap;
  const rows = Math.max(1, Math.floor((height + gap) / stride));
  const stackHeight = rows * size + (rows - 1) * gap;

  return {
    size,
    rows,
    stride,
    originX: x + (width - size) / 2,
    originY: y + height - stackHeight,
  };
}

/**
 * Edge length for a row when tapering from `maxSize` (top) to `minSize` (bottom).
 * `rowFromTop` is 0 at the top of the column.
 */
export function cubeSizeAtRow(
  rowFromTop: number,
  rows: number,
  maxSize: number,
  minSize: number,
): number {
  if (rows <= 1 || minSize >= maxSize) return maxSize;
  const t = rowFromTop / (rows - 1);
  return maxSize + (minSize - maxSize) * t;
}

/**
 * Fill opacity for a row when tapering from 1 (top) to `minOpacity` (bottom).
 * Uses a ease-in curve so the washout accelerates toward the baseline.
 */
export function cubeOpacityAtRow(
  rowFromTop: number,
  rows: number,
  minOpacity: number = DEFAULT_CUBE_MIN_OPACITY,
): number {
  if (rows <= 1) return 1;
  const t = rowFromTop / (rows - 1);
  const eased = t * t;
  return 1 + (Math.min(1, Math.max(0, minOpacity)) - 1) * eased;
}

/**
 * Lay out cubes for one series segment within a category column.
 *
 * - Single / grouped: omit `segmentY`, `includeEmpty: true` (default).
 * - Stacked: pass each layer's bar `y` as `segmentY`; only the first series
 *   should set `includeEmpty: true` so the ghost tower is drawn once.
 */
export function layoutCubeColumn(input: LayoutCubeColumnInput): CubeRect[] {
  const gap = input.gap ?? DEFAULT_CUBE_GAP;
  const radius = input.radius ?? DEFAULT_CUBE_RADIUS;
  const preferred = input.preferredSize ?? DEFAULT_CUBE_SIZE;
  const includeEmpty = input.includeEmpty !== false;
  const { column } = input;

  const grid = resolveCubeGrid(column, gap, preferred);
  if (!grid) return [];

  const { size, rows, stride, originX, originY } = grid;
  const rawMin = input.minSize;
  const taper =
    typeof rawMin === "number" &&
    Number.isFinite(rawMin) &&
    rawMin > 0 &&
    rawMin < size;
  const minSize = taper ? Math.max(1, rawMin) : size;
  const minOpacity =
    typeof input.minOpacity === "number" && Number.isFinite(input.minOpacity)
      ? Math.min(1, Math.max(0, input.minOpacity))
      : DEFAULT_CUBE_MIN_OPACITY;
  const baseline = column.y + column.height;
  const segH = Math.max(0, input.valueHeight);
  const segTop = input.segmentY ?? baseline - segH;
  const segBottom = segTop + segH;

  const startIdx = valueToCubeCount(Math.max(0, baseline - segBottom), column.height, rows);
  const endIdx = valueToCubeCount(Math.max(0, baseline - segTop), column.height, rows);

  const rects: CubeRect[] = [];
  for (let i = 0; i < rows; i++) {
    const filled = i >= startIdx && i < endIdx;
    if (!filled && !includeEmpty) continue;
    const rowFromTop = rows - 1 - i;
    // Absolute plot Y: same horizontal row → same size/opacity across every bar.
    const cubeSize = taper
      ? cubeSizeAtRow(rowFromTop, rows, size, minSize)
      : size;
    const opacity = taper ? cubeOpacityAtRow(rowFromTop, rows, minOpacity) : 1;
    // Always center inside the max-size cell so the column shares one vertical axis.
    const inset = (size - cubeSize) / 2;
    rects.push({
      x: originX + inset,
      y: originY + rowFromTop * stride + inset,
      size: cubeSize,
      radius: Math.min(radius, cubeSize / 2),
      opacity,
      filled,
    });
  }
  return rects;
}
