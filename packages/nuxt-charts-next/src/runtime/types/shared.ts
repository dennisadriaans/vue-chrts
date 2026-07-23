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
  /**
   * Id of the y-axis this series is plotted against. Series sharing an id share
   * a scale. Defaults to the primary axis, so charts that omit it are unchanged.
   */
  yAxis?: AxisId;
}

/** Identifies one y-axis. Series and axis configs are matched by this value. */
export type AxisId = string | number;

/**
 * Configuration for one y-axis in a multi-axis chart, keyed by {@link AxisId}
 * in the `yAxes` prop.
 */
export interface YAxisConfig extends AxisConfig {
  /** Which side of the plot area the axis is drawn on. Default `left`. */
  orientation?: "left" | "right";
  /** Axis label. */
  label?: string;
  /** Fixed domain as `[min, max]`. */
  domain?: [number | undefined, number | undefined];
  /** Desired number of ticks. */
  numTicks?: number;
  /** Formats this axis' ticks. */
  formatter?: axisFormatter;
  /** Hide the axis while still plotting its series. */
  hide?: boolean;
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
  /** Tick label font size, applied as the tick `<text>` `font-size`. */
  tickTextFontSize?: string;
  /** Tick label colour, applied as the tick `<text>` `fill`. */
  tickTextColor?: string;
  /** Tick label horizontal anchor (`left`→`start`, `right`→`end`, `center`→`middle`). */
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
/** Per-series marker (dot) options. */
export type MarkerSeriesConfig = {
  type?: "circle" | "square" | "triangle" | "diamond";
  size?: number;
  strokeWidth?: number;
  color?: string;
  strokeColor?: string;
};

/**
 * Marker configuration keyed by series (category) key, matching the v2 docs
 * usage: `:marker-config="{ desktop: { type: 'circle', size: 6 } }"`.
 *
 * The legacy `{ id, config }` wrapper shape is still accepted for back-compat;
 * the adapter reads `config` when present, else treats the value as the flat map.
 */
export type MarkerConfig =
  | Record<string, MarkerSeriesConfig>
  | { id?: string; config: Record<string, MarkerSeriesConfig> };

/** Per-side chart padding in pixels. */
export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Per-chart appearance overrides. Every field maps onto a `--vc-*` CSS token
 * (`runtime/assets/theme.css` for SVG + tokens, `runtime/assets/components.css`
 * for HTML chrome) written inline on the chart root. Set `theme.legend.size` to
 * scale legend, axis ticks, axis titles, and radar labels together.
 */
export interface ChartTheme {
  /** Grid + axis (domain) lines. */
  grid?: {
    /** Line colour. Token: `--vc-grid-color`. */
    color?: string;
    /** SVG dash pattern, e.g. `"3 3"` (solid: `"0"`). Token: `--vc-grid-dash`. */
    dash?: string;
    /** Line width in pixels. Token: `--vc-grid-width`. */
    width?: number;
  };
  /** Axis ticks + labels. */
  axis?: {
    /** Tick label colour. Token: `--vc-tick-color`. */
    tickColor?: string;
    /** Tick label size. Defaults to `--vc-legend-size`. Token: `--vc-tick-size`. */
    tickSize?: string;
    /** Tick label weight. Token: `--vc-tick-weight`. */
    tickWeight?: number | string;
    /** Axis title colour. Token: `--vc-axis-label-color`. */
    labelColor?: string;
    /** Axis title size. Defaults to `--vc-legend-size`. Token: `--vc-axis-label-size`. */
    labelSize?: string;
    /** Domain (axis) line colour. Token: `--vc-axis-line-color`. */
    lineColor?: string;
  };
  /** Legend text + spacing. */
  legend?: {
    /** Text colour. Token: `--vc-legend-color`. */
    color?: string;
    /** Font size for legend and all chart labels. Token: `--vc-legend-size`. */
    size?: string;
    /** Font weight. Token: `--vc-legend-weight`. */
    weight?: number | string;
    /** Gap between items, e.g. `"0.75rem"`. Token: `--vc-legend-gap`. */
    gap?: string;
    /** Gap between plot and legend, e.g. `"0.75rem"`. Token: `--vc-legend-inset`. */
    inset?: string;
  };
  /** Hover cursor (the band/rect behind the hovered point). */
  hover?: {
    /** Fill colour. Token: `--vc-hover-fill`. */
    fill?: string;
    /** Stroke colour. Token: `--vc-hover-stroke`. */
    stroke?: string;
    /** Corner radius in pixels. Token: `--vc-hover-radius`. */
    radius?: number;
    /** Set `false` to hide the hover cursor entirely (tooltip still shows). */
    visible?: boolean;
  };
  /** Tooltip container. */
  tooltip?: {
    /** Background colour. Token: `--vc-tooltip-bg`. */
    bg?: string;
    /** Text colour. Token: `--vc-tooltip-fg`. */
    fg?: string;
    /** Border colour. Token: `--vc-tooltip-border`. */
    border?: string;
    /** Corner radius, e.g. `"0.5rem"`. Token: `--vc-tooltip-radius`. */
    radius?: string;
  };
}
