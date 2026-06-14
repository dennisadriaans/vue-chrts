import type { CSSProperties } from "vue";

/**
 * Coerce a v2 `legendStyle` (a CSS string or a `Record<string,string>`) into the
 * `CSSProperties` object `vccs`'s `<Legend wrapperStyle>` expects. A raw CSS
 * string has no structured equivalent, so it's dropped (returns `undefined`)
 * rather than asserted.
 */
export function toCssProperties(
  style: string | Record<string, string> | undefined,
): CSSProperties | undefined {
  if (style === undefined || typeof style === "string") return undefined;
  return style as CSSProperties;
}

/**
 * Normalise a v2 domain tuple into a `vccs` axis `domain`. `vccs` requires both
 * bounds to be defined; if either is missing the whole domain is dropped
 * (returns `undefined`) so the axis auto-scales instead of erroring.
 */
export function toAxisDomain(
  domain: [number | undefined, number | undefined] | undefined,
): readonly [number, number] | undefined {
  if (!domain) return undefined;
  const [min, max] = domain;
  if (min === undefined || max === undefined) return undefined;
  return [min, max] as const;
}
