/**
 * Shared config types, preserved from `nuxt-charts` v2.
 *
 * Kept structurally identical to the v2 (`vue-chrts`) types so existing
 * templates keep type-checking after the engine swap to `vccs`. Types that
 * were Unovis-specific and have no `vccs` analog are retained as inert
 * shapes and marked `@deprecated` — passing them is a no-op, not an error.
 */

/**
 * Describes one category / series in a chart's legend: its label, colour, and
 * visibility. Keyed by the data property it represents in a `categories` record.
 */
export interface BulletLegendItemInterface {
  name: string | number;
  /** Series colour. An array is accepted for v2 compatibility; the first entry is used. */
  color?: string | Array<string>;
  className?: string;
  inactive?: boolean;
  hidden?: boolean;
  pointer?: boolean;
}

/**
 * Formats an axis tick value into a display string.
 * Mapped onto the `vccs` axis `tickFormatter(value, index)`.
 */
export type axisFormatter =
  | ((tick: number, i?: number, ticks?: number[]) => string)
  | ((tick: Date, i?: number, ticks?: Date[]) => string);

/**
 * Fine-grained axis appearance options.
 *
 * Only the fields with a `vccs` equivalent are applied (`tickFormatter`,
 * `tickLine`). The remaining text-layout fields are retained for v2
 * template compatibility and currently have no effect.
 */
export interface AxisConfig {
  tickLine?: boolean;
  tickFormat?: axisFormatter;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextFontSize?: string;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextColor?: string;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextAlign?: "left" | "right" | "center";
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextAngle?: number;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextWidth?: number;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextFitMode?: "wrap" | "trim";
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextTrimType?: "start" | "middle" | "end";
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextForceWordBreak?: boolean;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  tickTextSeparator?: string | readonly string[];
  minMaxTicksOnly?: boolean;
  /** @deprecated No `vccs` equivalent; retained for v2 compatibility. */
  minMaxTicksOnlyShowGridLines?: boolean;
  tickValues?: readonly number[] | readonly Date[];
}

/**
 * Tooltip behaviour options. Mapped onto `vccs` `<Tooltip>`.
 */
export interface TooltipConfig {
  /** Hide delay in milliseconds. */
  hideDelay?: number;
  /** Show delay in milliseconds. */
  showDelay?: number;
  /** If `true`, the tooltip follows the cursor. */
  followCursor?: boolean;
}

/**
 * @deprecated Unovis-only. `vccs` has no crosshair primitive; retained as an
 * inert type so v2 templates keep type-checking. Has no effect.
 */
export interface CrosshairConfig<T> {
  color?: string | ((d: T, i: number) => string | undefined);
  strokeColor?: string;
  strokeWidth?: number;
  template?: (d: T) => string;
}

/**
 * @deprecated Unovis-only. `vccs` has no custom marker primitive; retained as
 * an inert type so v2 templates keep type-checking. Has no effect.
 */
export type MarkerConfig = {
  id: string;
  config: {
    [key: string]: {
      type?: "circle" | "square" | "triangle" | "diamond";
      size?: number;
      strokeWidth?: number;
      color?: string;
      strokeColor?: string;
    };
  };
};

/** Per-side chart padding in pixels. */
export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
