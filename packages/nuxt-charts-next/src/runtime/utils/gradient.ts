/**
 * Build a deterministic gradient id for one series so the `<defs>` element and
 * the `fill="url(#id)"` reference agree.
 */
export function gradientId(dataKey: string): string {
  // Sanitise to a valid id fragment (data keys are usually simple, but be safe).
  return `nc-grad-${dataKey.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

/** Default vertical fade used when `gradientStops` is set without explicit stops. */
export const DEFAULT_GRADIENT_STOPS = [
  { offset: "0%", stopOpacity: 0.6 },
  { offset: "100%", stopOpacity: 0 },
];
