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

/** Default vertical fade used for the area fill when no explicit stops are given. */
export const DEFAULT_GRADIENT_STOPS: GradientStop[] = [
  { offset: "0%", stopOpacity: 0.6 },
  { offset: "100%", stopOpacity: 0 },
];
