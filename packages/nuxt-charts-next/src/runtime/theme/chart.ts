/**
 * Shared chart chrome theme, in the Nuxt UI component-theme shape
 * (`{ slots, variants, defaultVariants, compoundVariants }`), resolved with
 * Nuxt UI's own `tv` when `@nuxt/ui` is installed.
 *
 * Slot names deliberately match Nuxt UI's `UChart` (`root`, `tooltip`,
 * `tooltipTitle`, `tooltipRow`, `tooltipIndicator`, `tooltipLabel`,
 * `tooltipValue`), and the default classes reproduce `UChart` + `UTooltip`
 * exactly, so a nuxt-charts chart and a `UChart` side by side are styled by
 * the same tokens and the same `app.config` overrides (`ui.chart.slots` is
 * inherited — see `composables/useChartUi`).
 *
 * Colours are Nuxt UI semantic utilities (`text-muted`, `bg-default`,
 * `ring-default`, …). Typography and spacing that the SVG internals share with
 * the HTML chrome (legend size scales the axis ticks too) stay on the `--vc-*`
 * engine tokens via Tailwind's `(--var)` syntax, so one token still drives both.
 *
 * Tailwind scans this file: the module adds it as an `@source` of Nuxt UI's
 * stylesheet. Keep every class a complete literal string.
 */
export default {
  slots: {
    root: "relative w-full text-xs text-muted",
    tooltip:
      "flex flex-col items-stretch gap-1 min-w-32 px-2.5 py-1.5 text-xs bg-default text-highlighted shadow-sm rounded-sm ring ring-default pointer-events-none",
    // Single-row tooltips (funnel): the `tooltip` surface laid out inline.
    tooltipInline: "flex-row items-center whitespace-nowrap min-w-0",
    tooltipTitle: "m-0 font-medium text-highlighted",
    tooltipList: "m-0 p-0 list-none flex flex-col gap-1",
    tooltipRow: "flex items-center gap-1.5 text-muted data-[active=true]:text-highlighted",
    tooltipIndicator: "size-2 shrink-0 rounded-full",
    tooltipLabel: "truncate",
    tooltipValue: "ms-auto ps-4 font-medium text-highlighted tabular-nums",
    legend:
      "m-0 p-0 list-none flex flex-wrap items-center justify-center gap-(--vc-legend-gap) text-(length:--vc-legend-size) font-(--vc-legend-weight)",
    legendItem: "flex items-center gap-1.5 data-[inactive=true]:opacity-40",
    // Size and shape come from the `legendVariant` swatch rules (they need a
    // mask for the outline shapes), so only the non-shape bits live here.
    legendIndicator: "shrink-0",
    legendLabel: "text-muted",
    empty: "grid place-items-center text-(length:--vc-legend-size) text-muted",
    skeleton: "text-dimmed",
    skeletonLabel:
      "flex items-center gap-1.5 px-2 py-0.5 rounded-md ring ring-default bg-default text-xs text-muted",
  },
  variants: {
    tooltipVariant: {
      default: "",
      "frosted-glass": { tooltip: "bg-default/70 backdrop-blur-sm" },
    },
    tooltipRoundness: {
      sm: { tooltip: "rounded-xs" },
      md: { tooltip: "rounded-md" },
      lg: { tooltip: "rounded-lg" },
      xl: { tooltip: "rounded-xl" },
    },
  },
};
