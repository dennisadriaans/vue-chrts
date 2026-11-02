/**
 * `MetricChart` slots, layered on top of the shared chart theme. The card
 * chrome mirrors Nuxt UI primitives: the range picker reads like a
 * `UTabs` pill list, the actions like ghost `UButton`s, the delta like a
 * `UBadge`-coloured caption.
 * Keep every class a complete literal string (Tailwind scans this file).
 */
export default {
  slots: {
    root: "flex flex-col gap-4",
    header: "flex flex-col gap-2",
    heading: "flex flex-col gap-0.5",
    title: "m-0 text-sm font-medium text-highlighted",
    description: "m-0 text-xs text-muted",
    valueRow: "flex flex-wrap items-baseline gap-x-2 gap-y-1",
    value: "m-0 text-2xl font-semibold text-highlighted tabular-nums",
    valueSkeleton: "h-8 w-32 rounded-md bg-elevated animate-pulse",
    delta:
      "m-0 inline-flex items-center gap-1 text-xs font-medium tabular-nums data-[sentiment=positive]:text-success data-[sentiment=negative]:text-error data-[sentiment=neutral]:text-muted",
    deltaArrow: "",
    deltaAbsolute: "font-normal text-muted",
    deltaLabel: "font-normal text-muted",
    tableWrapper: "overflow-auto rounded-md ring ring-default",
    table:
      "w-full border-collapse text-xs tabular-nums [&_th]:px-3 [&_th]:py-2 [&_th]:text-start [&_th]:font-medium [&_th]:text-highlighted [&_td]:px-3 [&_td]:py-2 [&_td]:text-end [&_td]:text-default [&_thead]:bg-elevated/50 [&_tbody_tr]:border-t [&_tbody_tr]:border-default",
    footer: "flex flex-wrap items-center justify-between gap-2",
    ranges: "inline-flex items-center gap-0.5 p-0.5 rounded-md bg-elevated",
    range:
      "px-2 py-1 rounded-sm text-xs font-medium text-muted cursor-pointer transition-colors hover:text-highlighted data-[active=true]:bg-default data-[active=true]:text-highlighted data-[active=true]:shadow-xs focus-visible:outline-2 focus-visible:outline-primary",
    actions: "ms-auto flex items-center gap-1",
    action:
      "px-2 py-1 rounded-md text-xs font-medium text-muted cursor-pointer transition-colors hover:bg-elevated hover:text-highlighted aria-pressed:bg-elevated aria-pressed:text-highlighted disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary",
  },
};
