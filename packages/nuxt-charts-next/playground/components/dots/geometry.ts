/**
 * Shared geometry for the dot-only chart family.
 *
 * Every chart on the dots page is drawn from circles alone — no strokes, no
 * fills, no axes lines. These helpers turn values into dot positions so the
 * individual components stay presentational.
 */

/** A value that may be missing, so a series can have gaps. */
export type MaybeValue = number | null;

export interface DotPoint {
  label: string;
  value: MaybeValue;
  /**
   * Optional coarser bucket (a year, a quarter) that the point belongs to.
   * Charts with a long axis label these runs instead of every single point.
   */
  group?: string;
}

/** Ease-in fade used wherever dots wash out toward a baseline or an edge. */
export function fadeAt(t: number, minOpacity: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 + (minOpacity - 1) * clamped * clamped;
}

/** Largest finite value in a series, floored at 1 so scales never divide by 0. */
export function maxOf(points: DotPoint[]): number {
  const values = points
    .map((point) => point.value)
    .filter((value): value is number => value != null && Number.isFinite(value));
  return values.length ? Math.max(1, ...values) : 1;
}

/** Smallest finite value in a series; falls back to 0 for an empty series. */
export function minOf(points: DotPoint[]): number {
  const values = points
    .map((point) => point.value)
    .filter((value): value is number => value != null && Number.isFinite(value));
  return values.length ? Math.min(...values) : 0;
}
