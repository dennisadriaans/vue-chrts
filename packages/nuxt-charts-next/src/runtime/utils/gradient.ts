/**
 * Build a deterministic gradient id for one series so the `<defs>` element and
 * the `fill="url(#id)"` reference agree.
 */
export function gradientId(dataKey: string, scope?: string): string {
  const id = scope ? `${scope}-${dataKey}` : dataKey;
  return `nc-grad-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

/** One stop in a vertical area-fill gradient. */
export interface GradientStop {
  offset: string;
  stopOpacity: number;
}

/** One stop in a horizontal gradient used to paint a line or area outline. */
export interface StrokeGradientStop {
  offset: string;
  color: string;
  stopOpacity?: number;
}

/** Build the scoped id referenced by a gradient-painted series outline. */
export function strokeGradientId(dataKey: string, scope: string): string {
  return gradientId(`stroke-${dataKey}`, scope);
}

/** Default vertical fade used for the area fill when no explicit stops are given. */
export const DEFAULT_GRADIENT_STOPS: GradientStop[] = [
  { offset: "0%", stopOpacity: 0.6 },
  { offset: "100%", stopOpacity: 0 },
];
