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
   * Preferred cube edge length. Clamped to the band width so narrow categories
   * still fill the slot. Default 10.
   */
  preferredSize?: number;
}

export const DEFAULT_CUBE_GAP = 2;
export const DEFAULT_CUBE_RADIUS = 2;
export const DEFAULT_CUBE_SIZE = 10;
export const DEFAULT_CUBE_EMPTY_COLOR = "rgba(128, 128, 128, 0.14)";

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
  const baseline = column.y + column.height;
  const segH = Math.max(0, input.valueHeight);
  const segTop = input.segmentY ?? baseline - segH;
  const segBottom = segTop + segH;

  const startIdx = valueToCubeCount(Math.max(0, baseline - segBottom), column.height, rows);
  const endIdx = valueToCubeCount(Math.max(0, baseline - segTop), column.height, rows);
  const r = Math.min(radius, size / 2);

  const rects: CubeRect[] = [];
  for (let i = 0; i < rows; i++) {
    const filled = i >= startIdx && i < endIdx;
    if (!filled && !includeEmpty) continue;
    const rowFromTop = rows - 1 - i;
    rects.push({
      x: originX,
      y: originY + rowFromTop * stride,
      size,
      radius: r,
      filled,
    });
  }
  return rects;
}
