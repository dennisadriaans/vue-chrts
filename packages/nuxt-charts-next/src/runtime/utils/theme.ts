import type { CSSProperties } from "vue";
import type { ChartTheme } from "../types/shared";

/**
 * Flatten a {@link ChartTheme} into the `--vc-*` CSS custom properties the chart
 * components read (`runtime/assets/theme.css`, `runtime/assets/components.css`).
 * bound as an inline `style` on the `.vue-chrts` root, where it overrides the
 * global token defaults (inline custom properties beat class-scoped ones).
 *
 * Only the keys the caller actually set produce a variable, so unset fields fall
 * through to the shipped light/dark defaults. `hover.visible` is intentionally
 * *not* a token — it toggles the vccs `<Tooltip cursor>` prop and is surfaced
 * separately via {@link resolveHoverVisible}.
 */
export function themeToVars(theme: ChartTheme | undefined): CSSProperties {
  const vars: Record<string, string> = {};
  if (!theme) return vars as CSSProperties;

  const set = (name: string, value: string | number | undefined) => {
    if (value !== undefined) vars[name] = String(value);
  };

  set("--vc-grid-color", theme.grid?.color);
  set("--vc-grid-dash", theme.grid?.dash);
  set("--vc-grid-width", theme.grid?.width);

  set("--vc-tick-color", theme.axis?.tickColor);
  set("--vc-tick-size", theme.axis?.tickSize);
  set("--vc-tick-weight", theme.axis?.tickWeight);
  set("--vc-axis-label-color", theme.axis?.labelColor);
  set("--vc-axis-label-size", theme.axis?.labelSize);
  set("--vc-axis-line-color", theme.axis?.lineColor);

  set("--vc-legend-color", theme.legend?.color);
  set("--vc-legend-size", theme.legend?.size);
  set("--vc-legend-weight", theme.legend?.weight);
  set("--vc-legend-gap", theme.legend?.gap);
  set("--vc-legend-inset", theme.legend?.inset);

  set("--vc-hover-fill", theme.hover?.fill);
  set("--vc-hover-stroke", theme.hover?.stroke);
  set("--vc-hover-radius", theme.hover?.radius);

  set("--vc-tooltip-bg", theme.tooltip?.bg);
  set("--vc-tooltip-fg", theme.tooltip?.fg);
  set("--vc-tooltip-border", theme.tooltip?.border);
  set("--vc-tooltip-radius", theme.tooltip?.radius);

  return vars as CSSProperties;
}

/**
 * Whether the hover cursor should render. Defaults to `true`; only an explicit
 * `hover.visible === false` disables it.
 */
export function resolveHoverVisible(theme: ChartTheme | undefined): boolean {
  return theme?.hover?.visible !== false;
}

/** Default matches `--vc-hover-radius` in `theme.css`. vccs `Rectangle` needs a number. */
export const DEFAULT_HOVER_RADIUS = 6;

/**
 * Corner radius for the hover cursor rectangle. CSS vars can't be passed —
 * vccs validates `radius` as `Number | Array`.
 */
export function resolveHoverRadius(theme: ChartTheme | undefined): number {
  const r = theme?.hover?.radius;
  return typeof r === "number" && Number.isFinite(r) ? r : DEFAULT_HOVER_RADIUS;
}

/**
 * Map per-axis tick *colour / size / weight* (from {@link AxisConfig}) onto
 * scoped `--vc-{x|y}-tick-*` CSS variables read by
 * `.v-charts-cartesian-axis-tick-value`. These are applied via CSS (not the
 * vccs `tick` prop) because the stylesheet sets `fill` / `font-*`
 * unconditionally, so a CSS rule always wins over an SVG presentation attr.
 * Horizontal alignment is handled separately by the native `tick` prop, since
 * it must live in SVG space to position correctly (see `toTickProp`).
 */
export function axisTickVars(
  prefix: "x" | "y",
  tick: Record<string, unknown> | undefined,
): CSSProperties {
  const vars: Record<string, string> = {};
  if (!tick) return vars as CSSProperties;

  if (tick.fill !== undefined) vars[`--vc-${prefix}-tick-color`] = String(tick.fill);
  if (tick.fontSize !== undefined) vars[`--vc-${prefix}-tick-size`] = String(tick.fontSize);
  if (tick.fontWeight !== undefined) vars[`--vc-${prefix}-tick-weight`] = String(tick.fontWeight);

  return vars as CSSProperties;
}
